import {
  BadRequestException,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
  Delete,
  Inject,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IStorageService, StorageService } from '../shared/interfaces';
import { CustomFile } from './job-detail.storage-engine';
import { ConvertPathService } from './services';

@Controller('job-detail')
export class JobDetailController {
  constructor(
    private convertPathService: ConvertPathService,
    @Inject(StorageService) private storageSerice: IStorageService,
  ) {}

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

  @Delete()
  deleteFile(@Body('fileUrl') fileUrl: string) {
    const filePath = this.convertPathService.extractFilePathFromUrl(fileUrl);

    if (!filePath) {
      throw new BadRequestException();
    }

    this.storageSerice.delete(filePath);

    return {
      statusCode: HttpStatus.OK,
    };
  }
}
