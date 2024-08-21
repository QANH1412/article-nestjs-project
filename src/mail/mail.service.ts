// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ gửi email khác
    auth: {
      user: 'voquocanh123456789@gmail.com',
      pass: 'obve ujhy sbed rmta',
    },
  });

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    });
  }
}
