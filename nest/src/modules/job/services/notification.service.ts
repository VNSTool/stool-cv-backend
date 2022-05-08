import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_EMAIL_CONFIRMATION,
  NOTIFICATION_EMAIL_TO_PERSONAL_EMAIL,
  NOTIFICATION_FACEBOOK_MESSENGER,
} from '~/common/constants/job.constants';
import { IQueueService, QueueService } from '~/modules/shared/interfaces';
import { ApiConfigService } from '~/modules/shared/services';
import { CreateJobDto } from '../dtos/create-job.dto';

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
    private apiConfigService: ApiConfigService,
  ) {
    this.queue = apiConfigService.appConfig.aws.jobSharingQueue;
  }

  async sendNotification(message: CreateJobDto): Promise<void> {
    for (let notification of this.notifications) {
      await this.queueService.sendMessage(this.queue, message, notification);
    }
  }
}
