import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { InvalidEmailException } from 'src/exceptions/invalidEmail.exception';

@Injectable()
export class SESSendHelper {
  private readonly logger = new Logger(SESSendHelper.name);
  constructor(
    private readonly configService: ConfigService,
    @Inject('SESSender')
    private readonly ses: SES,
  ) {}

  #createDefaultHtmlTemplate(text: string) {
    return `
    <html>
        <body>
            <h1>Librefind</h1>
            <main>
                <p>다음 번호로 인증을 계속하세요.</p>
                <p>${text}</p>
            </main>
        <body>
    </html>
    `;
  }

  async sendMail(userEmail: string, title: string, text: string) {
    try {
      const params = {
        Destination: {
          ToAddresses: [userEmail],
          CcAddresses: [],
          BccAddresses: [],
        },
        Message: {
          Subject: {
            Data: title,
            Charset: 'utf-8',
          },
          Body: {
            Html: {
              Data: this.#createDefaultHtmlTemplate(text),
              Charset: 'utf-8',
            },
          },
        },
        Source: this.configService.get<string>('SES_ADMIN_EMAIL'),
        ReplyToAddresses: [this.configService.get<string>('SES_ADMIN_EMAIL')],
      };
      const result = await this.ses.sendEmail(params).promise();
      if (result.$response.error) {
        throw result.$response.error;
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      if (error.statusCode === HttpStatus.BAD_REQUEST) {
        throw new InvalidEmailException();
      }
      throw new Error(error);
    }
  }
}
