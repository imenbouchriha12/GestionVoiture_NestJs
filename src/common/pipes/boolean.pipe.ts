import { PipeTransform, BadRequestException } from '@nestjs/common';

export class BooleanPipe implements PipeTransform {
  transform(value: any) {
    if (value === true || value === false) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new BadRequestException('Value must be boolean');
  }
}