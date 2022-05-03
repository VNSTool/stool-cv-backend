import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';

const ACCEPTABLE_TYPES = ['application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;

@Injectable()
export class ValidateFilePipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!ACCEPTABLE_TYPES.includes(value.mimetype))
      throw new BadRequestException('Wrong file type');

    if (value.size > MAX_SIZE) throw new BadRequestException('File too large');

    return value;
  }
}
