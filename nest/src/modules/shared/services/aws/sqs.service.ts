import {
  SendMessageCommand,
  SQSClient,
  SQSClientConfig,
} from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';

import {
  ApiConfigService,
  AWSConfig,
  AppLogger,
} from '~/modules/shared/services';
import { IQueueService } from '~/modules/shared/interfaces';

import { TYPE_SQS } from '~/common/constants/queue.constants';

@Injectable()
export class AwsSqsService implements IQueueService {
  private client: SQSClient;
  private awsConfig: AWSConfig;
  public queue_type: string = TYPE_SQS;

  constructor(configService: ApiConfigService, private logger: AppLogger) {
    this.awsConfig = configService.appConfig.aws;

    const config: SQSClientConfig = {
      region: this.awsConfig.region,
    };

    if (this.awsConfig.profile) {
      config.credentials = fromIni({ profile: this.awsConfig.profile });
    }

    this.client = new SQSClient(config);
  }

  async sendMessage(queue: string, message: any, group: string) {
    const command = new SendMessageCommand({
      MessageAttributes: {
        Email: {
          DataType: 'String',
          StringValue: message.email,
        },
        CreatedAt: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
      MessageBody: JSON.stringify(message),
      MessageGroupId: group,
      QueueUrl: queue,
    });

    const response = await this.client.send(command);
    this.logger.log(response);
  }
}
