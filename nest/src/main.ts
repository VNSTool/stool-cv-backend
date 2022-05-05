import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { AppLogger } from '~/modules/shared/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: [/localhost/, /stool\.vn$/],
  });

  app.useLogger(new AppLogger());
  await app.listen(3000);
}
bootstrap();
