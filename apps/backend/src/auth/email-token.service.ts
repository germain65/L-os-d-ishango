import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class EmailTokenService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateVerificationToken(user: User): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24h

    await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return token;
  }

  async generatePasswordResetToken(user: User): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1h

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return token;
  }

  async verifyEmailToken(token: string): Promise<User | null> {
    const verificationToken = await this.prisma.emailVerificationToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      return null;
    }

    // Marquer l'email comme vérifié
    const updatedUser = await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // Supprimer le token utilisé
    await this.prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return updatedUser;
  }

  async verifyPasswordResetToken(token: string): Promise<User | null> {
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return null;
    }

    return resetToken.user;
  }

  async invalidatePasswordResetToken(token: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { token },
    });
  }
}
