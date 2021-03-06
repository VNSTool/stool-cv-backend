import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  env: string;
  aws: AWSConfig;
}

export interface AWSConfig {
  profile: string;
  region: string;
  s3Bucket: string;
  cloudFrontCdn: string;
  jobSharingQueue: string;
}

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig(): AppConfig {
    return {
      env: this.getString('APP_ENV'),
      aws: {
        profile: this.getString('AWS_PROFILE'),
        region: this.getString('AWS_REGION'),
        s3Bucket: this.getString('S3_BUCKET'),
        cloudFrontCdn: this.getString('CLOUDFRONT_CDN'),
        jobSharingQueue: this.getString('AWS_JOB_SHARING_QUEUE'),
      },
    };
  }

  get isProd(): Boolean {
    return this.appConfig['env'] === 'prod';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (null === value || undefined === value) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}
