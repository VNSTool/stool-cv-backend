import { S3Client, DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';
import internal from 'stream';

import {
  ApiConfigService,
  AWSConfig,
  AppLogger,
} from '~/modules/shared/services';
import { IStorageService } from '~/modules/shared/interfaces';

@Injectable()
export class AwsS3Service implements IStorageService {
  public storage_type: string = 'S3';
  private client: S3Client;
  private awsConfig: AWSConfig;

  constructor(configService: ApiConfigService, private logger: AppLogger) {
    this.awsConfig = configService.appConfig.aws;

    this.client = new S3Client({
      region: this.awsConfig.region,
      credentials: fromIni({ profile: this.awsConfig.profile }),
    });
  }

  public async save(key: string, body: internal.Readable | ReadableStream) {
    const location = this.awsConfig.s3Bucket + '/' + key;
    this.logger.log({
      action: 'UPLOAD_START',
      location,
    });

    const params = {
      Bucket: this.awsConfig.s3Bucket,
      Key: key,
      Body: body,
    };

    const parallelUploads3 = new Upload({
      client: this.client,
      queueSize: 4,
      partSize: 5242880,
      leavePartsOnError: false,
      params,
    });

    parallelUploads3.on('httpUploadProgress', (progress: Progress) => {
      this.logger.log({
        action: 'UPLOADING',
        location,
        progress,
      });
    });

    await parallelUploads3.done();
    this.logger.log({
      action: 'UPLOAD_FINISH',
      location,
    });
  }

  public async delete(key: string) {
    const location = this.awsConfig.s3Bucket + '/' + key;
    this.logger.log({
      action: 'DELETE_START',
      location,
    });
    const results = await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.awsConfig.s3Bucket,
        Key: key,
      }),
    );
    this.logger.log({
      action: 'DELETE_FINISH',
      location,
    });
  }
}
