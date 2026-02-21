import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, Categorie, Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
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
    await this.prisma.user.create({
      data: {
        email,
        pseudo,
        passwordHash,
        categorie,
        role: 'PARTICIPANT',
      },
    });

    return { message: 'Utilisateur créé avec succès' };
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
}
