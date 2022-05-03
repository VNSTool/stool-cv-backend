import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { ValidateFilePipe } from '~/modules/job-detail/pipes/validate-file.pipe';
import { AwsS3Service } from '../shared/services/aws-s3.service';

@Controller('job-detail')
export class JobDetailController {
  constructor(private awsS3Service: AwsS3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(ValidateFilePipe) file: Express.Multer.File) {
    this.awsS3Service.uploadJobDetail(file);
  }
}
