import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiConfigService, AppLogger } from '../services';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(
    private appLogger: AppLogger,
    private apiConfigService: ApiConfigService,
  ) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      this.appLogger.log(errors);

      const errorMessage: string | Array<any> = this.apiConfigService.isProd
        ? 'Validation failed'
        : errors;

      throw new BadRequestException(errorMessage);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
