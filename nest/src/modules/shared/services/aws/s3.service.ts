import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommandInput,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';
import internal from 'stream';

import {
  ApiConfigService,
  AWSConfig,
  AppLogger,
} from '~/modules/shared/services';

import { IStorageService } from '../../interfaces';
import { PUBLIC_READ } from '~/common/constants/aws-file-acl.constants';
import { TYPE_S3 } from '~/common/constants/storage.constants';

@Injectable()
export class AwsS3Service implements IStorageService {
  private client: S3Client;
  private awsConfig: AWSConfig;
  public storage_type: string = TYPE_S3;

  constructor(configService: ApiConfigService, private logger: AppLogger) {
    this.awsConfig = configService.appConfig.aws;

    const config: S3ClientConfig = {
      region: this.awsConfig.region,
    };

    if (this.awsConfig.profile) {
      config.credentials = fromIni({ profile: this.awsConfig.profile });
    }

    this.client = new S3Client(config);
  }

  public async save(
    key: string,
    body: internal.Readable | ReadableStream,
  ): Promise<Error | null> {
    const location = this.awsConfig.s3Bucket + '/' + key;
    this.logger.log({
      action: 'UPLOAD_START',
      location,
    });

    const params: PutObjectCommandInput = {
      Bucket: this.awsConfig.s3Bucket,
      Key: key,
      Body: body,
      ACL: PUBLIC_READ,
    };

    try {
      const parallelUploads3 = new Upload({
        client: this.client,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
        leavePartsOnError: false,
        params,
      });

      parallelUploads3.on('httpUploadProgress', async (progress: Progress) => {
        this.logger.log({
          action: 'UPLOADING',
          location,
          progress,
        });
      });

      await parallelUploads3.done();
    } catch (e) {
      return e;
    }

    this.logger.log({
      action: 'UPLOAD_FINISH',
      location,
    });
  }

  public async delete(key: string): Promise<Error | null> {
    const location = this.awsConfig.s3Bucket + '/' + key;
    this.logger.log({
      action: 'DELETE_START',
      location,
    });
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.s3Bucket,
          Key: key,
        }),
      );
    } catch (e) {
      return e;
    }

    this.logger.log({
      action: 'DELETE_FINISH',
      location,
    });
  }
}
