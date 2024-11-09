import { HttpStatus } from '@nestjs/common';

export class ResponseModel<T> {
  data?: T;
  statusCode: HttpStatus;

  constructor(obj: ResponseModel<T>) {
    Object.assign(this, obj);
  }
}
