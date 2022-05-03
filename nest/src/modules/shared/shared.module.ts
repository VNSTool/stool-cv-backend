import { Global, Module } from '@nestjs/common';

import { ApiConfigService, AwsS3Service } from '~/modules/shared/services';
import { StorageService } from './interfaces';

@Global()
@Module({
  providers: [
    ApiConfigService,
    {
      provide: StorageService,
      useClass: AwsS3Service,
    },
  ],
  exports: [ApiConfigService, StorageService],
})
export class SharedModule {}
