import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export interface ClassConstructor {
  new (...args: any[]);
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeINterceptor(dto));
}

export class SerializeINterceptor implements NestInterceptor {
  constructor(private _dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this._dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
