import { PipeTransform, BadRequestException } from '@nestjs/common';

export class SearchPipe implements PipeTransform {
  transform(value: string) {
    if (!value || value.length < 2) {
      throw new BadRequestException(
        'Search query must contain at least 2 characters',
      );
    }
    return value.toLowerCase();
  }
}
