import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { JobDetailController } from './job.controller';
import {
  ConvertPathService,
  MulterConfigService,
  NotificationService,
} from './services';

@Module({
  providers: [ConvertPathService, NotificationService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [JobDetailController],
})
export class JobDetailModule {}
