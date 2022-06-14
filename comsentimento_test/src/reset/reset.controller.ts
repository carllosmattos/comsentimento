import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';
import { EmailDto, ResetDto } from 'src/dtos/user.dto';
import { UserService } from 'src/user/user.service';
import { ResetService } from './reset.service';

@Controller()
export class ResetController {
    constructor(
        private resetService: ResetService,
        private mailerService: MailerService,
        private userService: UserService,
    ) { }

    @Post('forgot')
    @ApiOperation({ description: "Request a password recovery with this endpoint. Remember to inform the email." })
    @ApiResponse({
        status: 200,
        description: 'Mail sent has been successfully, Check your email'
    })
    async forgot(@Body() body: EmailDto) {
        const token = Math.random().toString(20).substring(2, 12);

        await this.resetService.save({
            email: body.email,
            token,
        });

        const url = `http://localhost:4200/reset/${token}`;
        await this.mailerService.sendMail({
            to: body.email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password!`,
        });

        return {
            message: 'Check your email',
        };
    }

    @Post('reset')
    @ApiOperation({ description: "Retrieve your password with this endpoint." })
    @ApiResponse({
        status: 200,
        description: 'Reset has been successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Passwords do not match',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async reset(
        @Body() body: ResetDto
    ) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not match!');
        }

        const reset = await this.resetService.findOneBy({ token: body.token });

        const user = await this.userService.findOneBy({ email: reset.email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userService.update(user.id, {
            password: await bcryptjs.hash(body.password, 12),
        });

        return {
            message: 'success',
        };
    };
}
