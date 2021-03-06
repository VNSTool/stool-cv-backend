import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
// import * as csurf from 'csurf';

import { AppModule } from '~/app.module';
import { AppLogger } from '~/modules/shared/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: [/localhost/, /stool\.vn$/],
  });

  app.useLogger(new AppLogger());
  // app.use(csurf());
  await app.listen(3000);
}
bootstrap();
