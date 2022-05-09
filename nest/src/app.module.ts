import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { JobDetailModule } from '~/modules/job/job.module';
import { SharedModule } from '~/modules/shared/shared.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    JobDetailModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
