import { Injectable, Inject } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { StorageService, IStorageService } from '~/modules/shared/interfaces';
import CustomStorageEngine from '~/modules/job-detail/job-detail.storage-engine';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(@Inject(StorageService) private storageSerice: IStorageService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: CustomStorageEngine({
        storageService: this.storageSerice,
      }),
    };
  }
}
