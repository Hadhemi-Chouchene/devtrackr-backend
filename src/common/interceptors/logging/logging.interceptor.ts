import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { AuthenticatedUser } from 'src/auth/types/authenticated-user.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, url } = request;

    const user = request.user as AuthenticatedUser | undefined;
    const userId = user?.userId || 'Anonymous';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        console.log(
          'method',
          method,
          'url',
          url,
          'userId',
          userId,
          'duration',
          `${delay}ms`,
          'status',
          'success',
        );
      }),
    );
  }
}
