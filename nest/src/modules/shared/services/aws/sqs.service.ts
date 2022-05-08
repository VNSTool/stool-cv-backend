import {
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
  SQSClientConfig,
} from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

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
  private waitTimeSeconds: number = 20;
  private maximumMessageReceive: number = 10;
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

  async sendMessage(queue: string, message: any, type: string): Promise<void> {
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
        Type: {
          DataType: 'String',
          StringValue: type,
        },
      },
      MessageBody: JSON.stringify(message),
      MessageGroupId: type,
      QueueUrl: queue,
    });

    const response = await this.client.send(command);
    this.logger.log(response);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new InternalServerErrorException();
    }
  }

  async receiveMessage(queue: string): Promise<Object> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queue,
      MaxNumberOfMessages: this.maximumMessageReceive,
      WaitTimeSeconds: this.waitTimeSeconds,
      MessageAttributeNames: ['Type'],
    });

    const response = await this.client.send(command);
    this.logger.log(response);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new InternalServerErrorException();
    }

    const sqsMessages = response.Messages;
    return sqsMessages.map((message) => ({
      messageId: message.MessageId,
      attributes: message.MessageAttributes,
      body: JSON.parse(message.Body),
    }));
  }
}
