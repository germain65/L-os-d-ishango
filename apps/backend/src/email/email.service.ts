import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = parseInt(this.configService.get<string>('SMTP_PORT', '587'));
    const secure = this.configService.get<string>('SMTP_SECURE', 'false') === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('Configuration SMTP manquante - emails en mode test');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

    const html = this.generateVerificationTemplate(user.pseudo, verificationUrl);

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM', 'noreply@los-d-ishango.org'),
      to: user.email,
      subject: 'Vérifiez votre email - L\'Os d\'Ishango',
      html,
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email de vérification envoyé à ${user.email}`);
      } else {
        this.logger.log(`[TEST] Email de vérification pour ${user.email}: ${verificationUrl}`);
      }
    } catch (error) {
      this.logger.error(`Erreur envoi email à ${user.email}:`, error);
      throw new Error('Impossible d\'envoyer l\'email de vérification');
    }
  }

  private generateVerificationTemplate(pseudo: string, verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification email - L'Os d'Ishango</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 30px;
        }
        .title {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 20px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #f59e0b;
            color: #1f2937;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #d97706;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .math-icon {
            font-size: 40px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="math-icon">🦴</div>
        <div class="logo">L'Os d'Ishango</div>
        
        <h1 class="title">Vérifiez votre email</h1>
        <p class="subtitle">
            Bonjour <strong>${pseudo}</strong>,<br>
            Merci de vous être inscrit sur L'Os d'Ishango !
        </p>
        
        <p>
            Pour activer votre compte et commencer à résoudre des exercices de mathématiques,
            veuillez cliquer sur le bouton ci-dessous :
        </p>
        
        <a href="${verificationUrl}" class="button">
            Vérifier mon email
        </a>
        
        <p style="font-size: 14px; color: #6b7280;">
            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
            <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
        </p>
        
        <div class="footer">
            <p>Cet email expirera dans 24 heures.</p>
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
            <p style="margin-top: 20px;">
                <small>L'Os d'Ishango - Plateforme de concours de mathématiques</small>
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation mot de passe - L'Os d'Ishango</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 30px;
        }
        .title {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">L'Os d'Ishango</div>
        <h1 class="title">Réinitialisez votre mot de passe</h1>
        <p>Bonjour <strong>${user.pseudo}</strong>,</p>
        <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        <a href="${resetUrl}" class="button">Réinitialiser le mot de passe</a>
        <p style="font-size: 14px; color: #6b7280;">
            Ce lien expirera dans 1 heure.
        </p>
        <div class="footer">
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
    </div>
</body>
</html>`;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM', 'noreply@los-d-ishango.org'),
      to: user.email,
      subject: 'Réinitialisation mot de passe - L\'Os d\'Ishango',
      html,
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email de réinitialisation envoyé à ${user.email}`);
      } else {
        this.logger.log(`[TEST] Email de réinitialisation pour ${user.email}: ${resetUrl}`);
      }
    } catch (error) {
      this.logger.error(`Erreur envoi email à ${user.email}:`, error);
      throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
    }
  }
}
