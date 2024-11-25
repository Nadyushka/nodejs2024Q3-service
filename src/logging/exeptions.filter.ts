import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    this.loggingService.error(
      `Error: ${exception.message || exception.name}, 
        URL: ${request.url},
        Method: ${request.method}, 
        Stack: ${exception.stack}`,
    );

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.response?.message || 'Internal Server Error';

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
