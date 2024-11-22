import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // 모든 도메인 허용 (보안상 필요한 경우 도메인을 제한할 수 있음)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3005);
  // if(module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(()=> app.close());
  // }
}
bootstrap();
