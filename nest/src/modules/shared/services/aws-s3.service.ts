import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';
import internal from 'stream';

import { ApiConfigService, AWSConfig } from '~/modules/shared/services';
import { IStorageService } from '../interfaces';

@Injectable()
export class AwsS3Service implements IStorageService {
  private client: S3Client;
  private awsConfig: AWSConfig;

  constructor(configService: ApiConfigService) {
    this.awsConfig = configService.appConfig.aws;

    this.client = new S3Client({
      region: this.awsConfig.region,
      credentials: fromIni({ profile: this.awsConfig.profile }),
    });
  }

  public async save(key: string, body: internal.Readable | ReadableStream) {
    const params = {
      Bucket: this.awsConfig.s3Bucket,
      Key: key,
      Body: body,
    };

    try {
      const parallelUploads3 = new Upload({
        client: this.client,
        queueSize: 4, // optional concurrency configuration
        partSize: 5242880, // optional size of each part
        leavePartsOnError: false, // optional manually handle dropped parts
        params,
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      await parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
  }

  public async delete(key: string) {
    const results = await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.awsConfig.s3Bucket,
        Key: key,
      }),
    );
  }
}
