import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let error = 'InternalError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        if (Array.isArray(res.message)) {
          message = res.message.join(', ');
        } else if (res.message) {
          message = res.message;
        }
      }

      error = exception.name.replace('Exception', '');
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
    });
  }
}
