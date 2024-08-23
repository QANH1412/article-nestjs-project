// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service'; // Đảm bảo đường dẫn đúng

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.emailUser,
        pass: this.configService.emailPass,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Please reset your password by clicking <a href="${url}">here</a>.</p>`,
    });
  }
}
