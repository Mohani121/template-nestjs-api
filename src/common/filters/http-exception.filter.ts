import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    // Log the full error
    this.logger.error(exception)

    const errorMessage =
      typeof message === 'string' ? message : (message as any).message || 'Internal server error'

    response.status(status).json({
      success: false,
      error: {
        code: HttpStatus[status],
        message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    })
  }
}
