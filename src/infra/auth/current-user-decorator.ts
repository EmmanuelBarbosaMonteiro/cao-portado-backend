import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.stratedy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)