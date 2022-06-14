import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ResetController } from './reset.controller';
import { Reset } from './reset.entity';
import { ResetService } from './reset.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Reset]),
      MailerModule.forRoot({
          transport: {
            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: false,
            auth: {
               user: 'teste1234_4@yahoo.com',
               pass: 'sbchjafmuvmwemxh',
            },
            debug: false,
            logger: true

          },
          defaults: {
              from: 'mattostech@yahoo.com',
          },
      }),
      UserModule,
  ],
  controllers: [ResetController],
  providers: [ResetService]
})
export class ResetModule {}
