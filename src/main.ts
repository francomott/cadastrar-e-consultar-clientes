import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🔗 Swagger is running on: http://localhost:${port}/api`);
  console.log(`💼 Docs are running on: http://localhost:${port}/docs`);
}

bootstrap();

