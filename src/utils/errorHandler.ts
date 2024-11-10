import { HttpException, HttpStatus } from '@nestjs/common';

export const errorHandler = (e: unknown) => {
  if (e instanceof HttpException) {
    throw new HttpException(e.message, e.getStatus());
  }

  throw new HttpException(
    'Internal Server Error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
