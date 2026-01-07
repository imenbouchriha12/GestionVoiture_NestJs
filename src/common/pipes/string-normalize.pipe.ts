import { PipeTransform } from '@nestjs/common';

export class StringNormalizePipe implements PipeTransform {
  transform(value: string) {
    if (!value) return value;
    return value.trim().toLowerCase();
  }
}
