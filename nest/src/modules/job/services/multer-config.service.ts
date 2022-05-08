import { Injectable, Inject } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { StorageService, IStorageService } from '~/modules/shared/interfaces';
import jobDetailStorageEngine from '../job.storage-engine';

const ACCEPT_TYPES = [/.*pdf.*/];
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(@Inject(StorageService) private storageSerice: IStorageService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: jobDetailStorageEngine({
        storageService: this.storageSerice,
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        for (let type of ACCEPT_TYPES) {
          if (type.test(file.mimetype)) cb(null, true);
        }

        cb(null, false);
      },
    };
  }
}
