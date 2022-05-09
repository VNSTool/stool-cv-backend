import {
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
  SQSClientConfig,
} from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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

  async sendMessage(
    queue: string,
    message: any,
    types: string[],
  ): Promise<void> {
    const entries: SendMessageBatchRequestEntry[] = [];
    for (let type of types) {
      entries.push({
        Id: uuidv4(),
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
      });
    }
    const command = new SendMessageBatchCommand({
      Entries: entries,
      QueueUrl: queue,
    });

    const response = await this.client.send(command);
    this.logger.log('Send message to queue', response);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new InternalServerErrorException();
    }
  }

  async receiveMessage(queue: string): Promise<Object> | null {
    const command = new ReceiveMessageCommand({
      QueueUrl: queue,
      MaxNumberOfMessages: this.maximumMessageReceive,
      WaitTimeSeconds: this.waitTimeSeconds,
      MessageAttributeNames: ['Type'],
    });

    const response = await this.client.send(command);
    this.logger.log('Receive message from queue', response);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new InternalServerErrorException();
    }

    const sqsMessages = response.Messages;
    if (!sqsMessages || sqsMessages.length === 0) return null;

    return sqsMessages.map((message) => ({
      messageId: message.MessageId,
      attributes: message.MessageAttributes,
      body: JSON.parse(message.Body),
    }));
  }
}
