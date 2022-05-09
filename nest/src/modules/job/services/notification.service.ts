import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

import {
  NOTIFICATION_EMAIL_CONFIRMATION,
  NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL,
  NOTIFICATION_FACEBOOK_MESSENGER,
} from '~/common/constants/job.constants';
import { IQueueService, QueueService } from '~/modules/shared/interfaces';
import {
  EmailService,
  IEmailService,
} from '~/modules/shared/interfaces/email-service.interface';
import { ApiConfigService, AppLogger } from '~/modules/shared/services';
import { CreateJobDto } from '../dtos/create-job.dto';
import { NotificationDto } from '../dtos/notification.dto';

@Injectable()
export class NotificationService {
  private notifications: Array<string> = [
    NOTIFICATION_EMAIL_CONFIRMATION,
    NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL,
    NOTIFICATION_FACEBOOK_MESSENGER,
  ];

  private queue: string;

  constructor(
    @Inject(QueueService) private queueService: IQueueService,
    @Inject(EmailService) private emailService: IEmailService,
    private logger: AppLogger,
    apiConfigService: ApiConfigService,
  ) {
    this.queue = apiConfigService.appConfig.aws.jobSharingQueue;
  }

  async queueNotification(message: CreateJobDto): Promise<void> {
    await this.queueService.sendMessage(
      this.queue,
      message,
      this.notifications,
    );
  }

  @Cron('0 * * * * *')
  async handleNotification(): Promise<void> {
    let notifications: Array<NotificationDto>;
    notifications = await this.queueService.receiveMessage(this.queue);
    if (notifications && notifications.length !== 0) {
      for (let notification of notifications) {
        const notificationType = notification.attributes['Type']['StringValue'];
        let message: string;

        switch (notificationType) {
          case NOTIFICATION_FACEBOOK_MESSENGER:
            this.logger.warn('Skip. Not implemented yet.');
            break;

          case NOTIFICATION_EMAIL_CONFIRMATION:
            message = this.getTemplateString(
              'confirmation.hbs',
              notification.body,
            );
            await this.emailService.sendEmail(
              [notification.body.email],
              ['vnstool@gmail.com'],
              'Thanks for sharing jobs',
              message,
            );
            break;

          case NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL:
            message = this.getTemplateString(
              'inform-me.hbs',
              notification.body,
            );
            await this.emailService.sendEmail(
              ['nmtri881994@gmail.com'],
              ['vnstool@gmail.com'],
              'Jobs sharing',
              message,
            );
            break;
        }
      }
    }
  }

  private getTemplateString(
    template: string,
    createJobDto: CreateJobDto,
  ): string {
    const templateStr = fs
      .readFileSync(path.resolve(__dirname, '../email-templates', template))
      .toString('utf8');

    return Handlebars.compile(templateStr)(createJobDto);
  }
}
