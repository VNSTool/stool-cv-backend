import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  ApiConfigService,
  AWSConfig,
} from '~/modules/shared/services/api-config.service';

const JOB_DETAIL_FOLDER = 'job-detail';

@Injectable()
export class AwsS3Service {
  private client: S3Client;
  private awsConfig: AWSConfig;

  constructor(configService: ApiConfigService) {
    this.awsConfig = configService.appConfig.aws;

    this.client = new S3Client({
      region: this.awsConfig.region,
      credentials: fromIni({ profile: this.awsConfig.profile }),
    });
  }

  public uploadJobDetail(file: Express.Multer.File) {
    console.log(11, file);
    const key =
      JOB_DETAIL_FOLDER + '/' + this.generateUniqueName(file.originalname);
    this.upload(key, file.buffer);
  }

  private async upload(key: string, body: Buffer) {
    const results = await this.client.send(
      new PutObjectCommand({
        Bucket: this.awsConfig.s3Bucket,
        Key: key,
        Body: body,
      }),
    );

    console.log(results);
  }

  private generateUniqueName(fileName: string) {
    return uuidv4() + '.' + fileName;
  }
}
