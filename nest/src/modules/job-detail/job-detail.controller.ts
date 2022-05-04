import {
  BadRequestException,
  Controller,
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

    console.log(123, file.size);

    return {
      statusCode: 200,
      fileUrl: this.convertPathService.convertToCDN(file),
    };
  }
}
