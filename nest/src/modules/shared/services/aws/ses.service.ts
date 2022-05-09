import {
  SESv2Client,
  SESv2ClientConfig,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TYPE_SES } from '~/common/constants/email.constants';
import {
  ApiConfigService,
  AWSConfig,
  AppLogger,
} from '~/modules/shared/services';
import { IEmailService } from '../../interfaces/email-service.interface';

@Injectable()
export class AwsSesService implements IEmailService {
  private client: SESv2Client;
  private awsConfig: AWSConfig;
  public email_type: string = TYPE_SES;

  constructor(configService: ApiConfigService, private logger: AppLogger) {
    this.awsConfig = configService.appConfig.aws;

    const config: SESv2ClientConfig = {
      region: this.awsConfig.region,
    };

    if (this.awsConfig.profile) {
      config.credentials = fromIni({ profile: this.awsConfig.profile });
    }

    this.client = new SESv2Client(config);
  }

  async sendEmail(
    toAddresses: string[],
    bccAddresses: string[],
    subject: string,
    body: string,
  ) {
    const command = new SendEmailCommand({
      FromEmailAddress: 'no-reply@curriculumvitae.stool.vn',
      Destination: {
        ToAddresses: toAddresses,
        BccAddresses: bccAddresses,
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: body,
            },
          },
        },
      },
    });

    const response = await this.client.send(command);
    this.logger.log('Send mail response', response);
  }
}
