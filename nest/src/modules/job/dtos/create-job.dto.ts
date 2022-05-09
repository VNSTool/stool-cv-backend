import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsUrl,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { JobDetailFileDto } from './job-detail-file.dto';

export class CreateJobDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobDetailFileDto)
  @ValidateIf((obj) => obj.jobDetailUrls.length === 0)
  @ArrayMinSize(1)
  jobDetailFiles: Array<JobDetailFileDto>;

  @IsArray()
  @IsUrl(
    {},
    {
      each: true,
    },
  )
  @ValidateIf((obj) => obj.jobDetailFiles.length === 0)
  @ArrayMinSize(1)
  jobDetailUrls: Array<string>;
}
