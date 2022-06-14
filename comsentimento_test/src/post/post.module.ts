import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PostService } from './post.service';
import { Post } from './post.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Post]),
      UserModule,
      JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1w' },
      }),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostModule, PostService]
})
export class PostModule {}
