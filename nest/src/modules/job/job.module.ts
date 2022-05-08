import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { JobDetailController } from './job.controller';
import { ConvertPathService, MulterConfigService } from './services';
import { NotificationService } from './services/notification.service';

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
