import { HttpStatus } from '@nestjs/common';

export class ErrorModel {
  errorText: string;
  status: HttpStatus;

  constructor(obj: Partial<ErrorModel>) {
    Object.assign(this, obj);
  }
}
