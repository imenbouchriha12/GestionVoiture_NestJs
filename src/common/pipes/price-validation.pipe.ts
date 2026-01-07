import { PipeTransform, BadRequestException } from '@nestjs/common';

export class PriceValidationPipe implements PipeTransform {
  transform(value: number) {
    if (value < 0) {
      throw new BadRequestException('Price must be positive');
    }
    return value;
  }
}
