import { Injectable } from '@nestjs/common';

import { TYPE_S3 } from '~/common/constants/storage.constants';
import { ApiConfigService } from '~/modules/shared/services';
import { CustomFile } from '../job.storage-engine';

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

  extractFilePathFromUrl(url: string): string {
    const CdnPrefixes = [this.apiConfigService.appConfig.aws.jobDetailCdn];

    for (let cdnPrefix of CdnPrefixes) {
      let matches;
      if (
        (matches = url.match(
          new RegExp(
            `${cdnPrefix.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&')}/(.*)`,
          ),
        ))
      ) {
        return matches[1];
      }
    }

    return '';
  }
}
