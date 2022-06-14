import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
      origin: [
          'http://localhost:3000',
          'http://localhost:8080',
          'http://localhost:4200',
      ],
      credentials: true,
  });

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Api Comsentimento')
    .setDescription('Api for Comsentimento technical test')
    .setVersion('1.0')
    // .addServer(`${process.env.LOCAL_HOST}:${process.env.PORT}`, 'Base Url')
    .addServer('http://localhost:3000/', 'Base Url')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
