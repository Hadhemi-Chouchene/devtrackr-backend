import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

type RequestWithUser = {
  user: JwtPayload;
};

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    // Switch execution context to HTTP to access the request object
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    // request.user is populated by JwtStrategy after successful authentication

    // If a specific property is requested (e.g., @CurrentUser('email')), return that property
    if (data) {
      return request.user?.[data];
    }
    // Otherwise, return the entire user object
    return request.user;
  },
);
