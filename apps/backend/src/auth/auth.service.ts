import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { EmailTokenService } from './email-token.service';
import { User, Categorie, Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
    private emailTokenService: EmailTokenService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email, pseudo, password, categorie } = createUserDto;

    // Vérifier si l'email existe déjà
    const existingUserByEmail = await this.usersService.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Vérifier si le pseudo existe déjà
    const existingUserByPseudo = await this.usersService.findByPseudo(pseudo);
    if (existingUserByPseudo) {
      throw new ConflictException('Ce pseudo est déjà utilisé');
    }

    // Hasher le mot de passe
    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS', '12'));
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email,
        pseudo,
        passwordHash,
        categorie,
        role: 'PARTICIPANT',
      },
    });

    // Générer et envoyer le token de vérification email
    try {
      const verificationToken = await this.emailTokenService.generateVerificationToken(user);
      await this.emailService.sendVerificationEmail(user, verificationToken);
    } catch (error) {
      // Si l'email échoue, on ne bloque pas l'inscription
      console.error('Erreur envoi email de vérification:', error);
    }

    return { message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.' };
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const { passwordHash, ...userWithoutPassword } = user;

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: userWithoutPassword };
  }

  async validateUser(payload: { sub: string; email: string }): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return null;
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.emailTokenService.verifyEmailToken(token);
    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    return { message: 'Email vérifié avec succès' };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return { message: 'Si cet email existe, un email de réinitialisation a été envoyé' };
    }

    const resetToken = await this.emailTokenService.generatePasswordResetToken(user);
    await this.emailService.sendPasswordResetEmail(user, resetToken);

    return { message: 'Si cet email existe, un email de réinitialisation a été envoyé' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.emailTokenService.verifyPasswordResetToken(token);
    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS', '12'));
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await this.emailTokenService.invalidatePasswordResetToken(token);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
