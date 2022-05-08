import {
  BadRequestException,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
  Delete,
  Inject,
  Param,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IStorageService, StorageService } from '../shared/interfaces';
import { CreateJobDto } from './dtos/create-job.dto';
import { CustomFile } from './job.storage-engine';
import { ConvertPathService } from './services';
import { NotificationService } from './services/notification.service';

@Controller('job')
export class JobDetailController {
  constructor(
    private convertPathService: ConvertPathService,
    private notificationService: NotificationService,
    @Inject(StorageService) private storageSerice: IStorageService,
  ) {}

  @Post('job-detail/upload')
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

  @Delete('job-detail/:fileUrl')
  deleteFile(@Param('fileUrl') fileUrl: string) {
    const filePath = this.convertPathService.extractFilePathFromUrl(fileUrl);

    if (!filePath) {
      throw new BadRequestException();
    }

    this.storageSerice.delete(filePath);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  async submitJob(@Body() createJobDto: CreateJobDto) {
    await this.notificationService.queueNotification(createJobDto);
    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get('test-notification')
  async testNotification() {
    await this.notificationService.handleNotification();
    return {
      statusCode: HttpStatus.CREATED,
    };
  }
}
