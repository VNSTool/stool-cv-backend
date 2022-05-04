import { Global, Module } from '@nestjs/common';

import {
  ApiConfigService,
  AwsS3Service,
  AppLogger,
} from '~/modules/shared/services';
import { StorageService } from '~/modules/shared/interfaces';

@Global()
@Module({
  providers: [
    ApiConfigService,
    {
      provide: StorageService,
      useClass: AwsS3Service,
    },
    AppLogger,
  ],
  exports: [ApiConfigService, StorageService, AppLogger],
})
export class SharedModule {}
