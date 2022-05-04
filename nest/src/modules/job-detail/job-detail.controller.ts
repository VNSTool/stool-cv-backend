import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFile } from './job-detail.storage-engine';
import { ConvertPathService } from './services';

@Controller('job-detail')
export class JobDetailController {
  constructor(private convertPathService: ConvertPathService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: CustomFile) {
    if (!file) {
      throw new BadRequestException('Invalid File');
    }

    return {
      statusCode: HttpStatus.CREATED,
      fileUrl: this.convertPathService.convertToCDN(file),
    };
  }
}
