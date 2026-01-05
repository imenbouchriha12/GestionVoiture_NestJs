import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SimpleInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const requestType = context.getType(); // http | ws

    return next.handle().pipe(
      map((data) => ({
        success: true,
        type: requestType,
        data,
      })),
    );
  }
}
