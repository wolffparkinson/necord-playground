import { NestFactory } from '@nestjs/core';
import { Logger as LoggerModule, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(LoggerModule));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.listen(33333)
}

bootstrap();
