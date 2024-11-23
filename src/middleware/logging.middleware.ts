import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;
    res.on('finish', () => {
      this.loggingService.info(
        `Request: 
        URL=${url}, 
        Method=${method}, 
        Query=${JSON.stringify(query)}, 
        Body=${JSON.stringify(body)}`,
      );
    });
    next();
  }
}
