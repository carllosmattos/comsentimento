import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { TokenService } from './token.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Token]),
      JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1w' },
      }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService, UserModule],
})
export class UserModule {}
