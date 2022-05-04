import { Injectable } from '@nestjs/common';

import { TYPE_S3 } from '~/common/constants/storage.constants';
import { ApiConfigService } from '~/modules/shared/services';
import { CustomFile } from '../job-detail.storage-engine';

@Injectable()
export class ConvertPathService {
  constructor(private apiConfigService: ApiConfigService) {}

  convertToCDN(file: CustomFile): string {
    let cdnPrefix: string = '';

    switch (file.storageType) {
      case TYPE_S3:
        cdnPrefix = this.apiConfigService.appConfig.aws.jobDetailCdn;
    }

    return cdnPrefix + '/' + file.path;
  }
}
