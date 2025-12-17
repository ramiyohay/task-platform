import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3000;
  const clientPort = process.env.CLIENT_PORT || 5173;

  app.enableCors({
    origin: `http://localhost:${clientPort}`,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  });

  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();
