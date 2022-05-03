import { Module } from '@nestjs/common';

import { ApiConfigService } from '~/modules/shared/services/api-config.service';
import { AwsS3Service } from '~/modules/shared/services/aws-s3.service';

@Module({
  providers: [ApiConfigService, AwsS3Service],
  exports: [ApiConfigService, AwsS3Service],
})
export class SharedModule {}
