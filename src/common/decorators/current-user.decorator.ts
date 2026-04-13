import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // Switch execution context to HTTP to access the request object
    const request = ctx.switchToHttp().getRequest();

    // request.user is populated by JwtStrategy after successful authentication

    // If a specific property is requested (e.g., @CurrentUser('email')), return that property
    if (data) {
      request.user?.[data];
    }
    // Otherwise, return the entire user object
    return request.user;
  },
);
