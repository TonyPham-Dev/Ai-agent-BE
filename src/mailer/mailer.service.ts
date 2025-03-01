import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import fs from 'node:fs/promises';

import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

import { AllConfigType } from '@config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      auth: {
        pass: configService.get('mail.password', { infer: true }),
        user: configService.get('mail.user', { infer: true }),
      },
      host: "smtp.gmail.com",
      // ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      port: 587,
      secure: false, 
      // requireTLS: true, 
    });
  }

  async sendMail({
    context,
    templatePath,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    context: Record<string, unknown>;
    templatePath: string;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }
    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
