import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3000)

  // Security
  app.use(helmet())
  app.enableCors()

  // Global pipes, filters, interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Template')
    .setDescription('Production-ready NestJS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}`)
  console.log(`�docs Swagger docs at http://localhost:${port}/api/docs`)
}

bootstrap()
