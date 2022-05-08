import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { JobDetailController } from './job.controller';
import { ConvertPathService, MulterConfigService } from './services';

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
