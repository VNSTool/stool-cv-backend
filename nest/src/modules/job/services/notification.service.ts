import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import {
  NOTIFICATION_EMAIL_CONFIRMATION,
  NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL,
  NOTIFICATION_FACEBOOK_MESSENGER,
} from '~/common/constants/job.constants';
import { IQueueService, QueueService } from '~/modules/shared/interfaces';
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
    for (let notification of notifications) {
      const notificationType = notification.attributes['Type']['StringValue'];

      switch (notificationType) {
        case NOTIFICATION_FACEBOOK_MESSENGER:
          this.logger.warn('Skip. Not implemented yet.');
          break;

        case NOTIFICATION_EMAIL_CONFIRMATION:
          this.logger.log('Todo. Implementing.');
          break;

        case NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL:
          this.logger.log('Todo. Implementing.');
          break;
      }
    }
  }
}
