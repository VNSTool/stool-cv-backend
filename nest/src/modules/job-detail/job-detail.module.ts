import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { JobDetailController } from '~/modules/job-detail/job-detail.controller';

import {
  MulterConfigService,
  ConvertPathService,
} from '~/modules/job-detail/services';

@Module({
  providers: [ConvertPathService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [JobDetailController],
})
export class JobDetailModule {}
