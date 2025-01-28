import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('api')
  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription("The SF_BACKEND api documentation")
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, documentFactory)

  const port =  process.env.PORT ?? 3000
  await app.listen(port, ()=>{
    console.log(`server at http://localhost:${port}`);
  });
}
bootstrap();
