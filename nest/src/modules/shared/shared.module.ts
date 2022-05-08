import { Global, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { QueueService, StorageService } from './interfaces';
import { ValidationPipe } from './pipes/validation.pipe';
import {
  ApiConfigService,
  AppLogger,
  AwsS3Service,
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
    AppLogger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [ApiConfigService, StorageService, QueueService, AppLogger],
})
export class SharedModule {}
