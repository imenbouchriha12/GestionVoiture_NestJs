import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SimpleInterceptor } from './interceptors/simple/simple.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // 🔒 Validation globale DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
   app.useGlobalInterceptors(new SimpleInterceptor());

  // 🔄 Serialization globale
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
