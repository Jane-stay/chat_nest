import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import * as cookie from 'cookie-parser';
import helmet from 'helmet';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);


  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(
    ['/docs'],
    basicAuth({
      users: { admin: 'pw123' },
      challenge: true,
      unauthorizedResponse: () => 'Unauthorized',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('chat api 문서')
    .setDescription('For test chat API')
    .setVersion('0.1')
    .addBearerAuth()
    // .addBearerAuth({ type: 'http' }, 'admin') //나중에
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const corsOption = {
    allowHeaders: ['Accept', 'Content-Type', 'Origin', 'Authorization'],
    origin: '*',
    credential: true,
  };

  app.use(cookie());
  app.enableCors(corsOption);
  app.use(helmet());
  app.setGlobalPrefix('/api/v1', {
    exclude: ['health'],
  });

 

  const port = configService.get<number>('PORT') || 3000;
 
  await app.listen(port);
}
bootstrap();
