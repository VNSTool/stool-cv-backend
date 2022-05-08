import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JobDetailModule } from '~/modules/job/job.module';
import { SharedModule } from '~/modules/shared/shared.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JobDetailModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
