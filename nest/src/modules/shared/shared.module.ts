import { Global, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { QueueService, StorageService } from './interfaces';
import { EmailService } from './interfaces/email-service.interface';
import { ValidationPipe } from './pipes/validation.pipe';
import {
  ApiConfigService,
  AppLogger,
  AwsS3Service,
  AwsSesService,
  AwsSqsService,
} from './services';

@Global()
@Module({
  providers: [
    ApiConfigService,
    {
      provide: StorageService,
      useClass: AwsS3Service,
    },
    {
      provide: QueueService,
      useClass: AwsSqsService,
    },
    {
      provide: EmailService,
      useClass: AwsSesService,
    },
    AppLogger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [
    ApiConfigService,
    StorageService,
    QueueService,
    EmailService,
    AppLogger,
  ],
})
export class SharedModule {}
