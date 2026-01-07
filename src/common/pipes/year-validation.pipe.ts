import { PipeTransform, BadRequestException } from '@nestjs/common';

export class YearValidationPipe implements PipeTransform {
  transform(value: number) {
    const currentYear = new Date().getFullYear();

    if (!value || value < 1950 || value > currentYear) {
      throw new BadRequestException(
        `Year must be between 1950 and ${currentYear}`,
      );
    }

    return value;
  }
}
