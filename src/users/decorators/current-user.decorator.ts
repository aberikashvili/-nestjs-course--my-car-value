import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const requerst = ctx.switchToHttp().getRequest();
    return requerst.currentUser;
  },
);
