import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params?.id;

    if (id && !isUUID(id)) {
      throw new HttpException(
        'Invalid ID format.',
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
