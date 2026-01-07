import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export class MongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }
    return value;
  }
}
