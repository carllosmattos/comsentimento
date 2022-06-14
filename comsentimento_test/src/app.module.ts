import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigService } from '@nestjs/config';
import { ResetModule } from './reset/reset.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'comsentimento_db',
      // url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,}),
    UserModule,
    ResetModule,
    PostModule
  ],
  controllers: [],
  providers: [
    AppService,
    ConfigService
  ],
})
export class AppModule {}
