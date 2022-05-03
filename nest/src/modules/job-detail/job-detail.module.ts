import { Module } from '@nestjs/common';

import { SharedModule } from '~/modules/shared/shared.module';
import { JobDetailController } from '~/modules/job-detail/job-detail.controller';

@Module({
  imports: [SharedModule],
  controllers: [JobDetailController],
})
export class JobDetailModule {}
