import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { JobDetailController } from '~/modules/job-detail/job-detail.controller';

import { MulterConfigService } from '~/modules/job-detail/services';
import { StorageService } from '../shared/interfaces';
import { AwsS3Service } from '../shared/services';

@Module({
  providers: [MulterConfigService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [JobDetailController],
})
export class JobDetailModule {}
