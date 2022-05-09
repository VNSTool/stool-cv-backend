import { IsUrl } from 'class-validator';

export class JobDetailFileDto {
  @IsUrl()
  fileUrl: string;
}
