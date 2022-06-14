import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { CreateUserDto, IdDto, LoginDto } from 'src/dtos/user.dto';
import { BadRequestExceptionAuth, Unauthorized } from 'src/handles/handle-exception';
import { ResponseToken } from 'src/responses/user.entity';
import { TokenService } from './token.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private tokenService: TokenService,
    ) { };

    @Post('register')
    @ApiOperation({description: "Register at this endpoint."})
    @ApiResponse({
      status: 200,
      description: 'Register has been successfully',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Passwords do not match!',
    })
    async register(@Body() body: CreateUserDto) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not match!');
        }
        return this.userService.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcryptjs.hash(body.password, 12),
        });
    };

    @Post('login')
    @ApiOperation({description: "Login with this endpoint."})
    @ApiResponse({
      status: 200,
      description: 'Login has been successfully',
      type: ResponseToken,
    })
    @ApiResponse({
      status: 400,
      description: 'Inavlid credencials',
    })
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const {
            email,
            password
        } = body;
        const user = await this.userService.findOneBy({email});

        if (!user) {
            throw new BadRequestExceptionAuth();
        }

        if (!(await bcryptjs.compare(password, user.password))) {
            throw new BadRequestExceptionAuth();
        }

        const accessToken = await this.jwtService.signAsync(
            {
                id: user.id,
            },
            { expiresIn: '1800s' },
        );

        const refreshToken = await this.jwtService.signAsync({
            id: user.id,
        });

        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 7);

        await this.tokenService.save({
            user_id: user.id,
            token: refreshToken,
            expired_at,
        });

        response.status(200);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
        });

        return {
            token: accessToken,
        };
    };

    @Get('user')
    @ApiOperation({description: "Search for a specific user with this endpoint. Remember to authorize first."})
    @ApiResponse({
      status: 200,
      description: 'Get user has been successfully',
      type: ResponseToken,
    })
    @ApiResponse({
      status: 400,
      description: 'Inavlid credencials',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
    @ApiBearerAuth('JWT-auth')
    async user(@Req() request: Request) {
        try {
            const accessToken = request.headers.authorization.replace(
                'Bearer ',
                '',
            );

            const { id } = await this.jwtService.verifyAsync(accessToken);

            const { password, ...data } = await this.userService.findOneBy({
                id,
            });

            return data;
        } catch (error) {
            throw new UnauthorizedException();
        };
    };

    @Post('refresh')
    @ApiOperation({description: "Update your token with this endpoint, remember to enter the previous token."})
    @ApiResponse({
      status: 200,
      description: 'Refresh has been successfully',
      type: ResponseToken,
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized',
    })
    @ApiBearerAuth('JWT-auth')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const refreshToken = request.cookies['refresh_token'];

            const { id } = await this.jwtService.verifyAsync(refreshToken);

            const tokenEntity = await this.tokenService.findOneBy({
                user_id: id,
            });

            if (!tokenEntity) {
                throw new UnauthorizedException();
            }

            const accessToken = await this.jwtService.signAsync(
                { id },
                { expiresIn: '1800s' },
            );

            response.status(200);
            return {
                token: accessToken,
            };
        } catch (error) {
            throw new UnauthorizedException();
        };
    };

    @Post('logout')
    @ApiOperation({description: "Endpoint to exit the session. Remember to authorize first."})
    @ApiResponse({
      status: 200,
      description: 'Logout has been successfully',
    })
    @ApiBearerAuth('JWT-auth')
    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.tokenService.delete({
            token: request.cookies['refresh_token'],
        });

        response.clearCookie('refresh_token');

        return {
            message: 'success',
        };
    };

    @Get('admin/users')
    @ApiOperation({ description: "Search for a list users with this endpoint. Remember to authorize first." })
    @ApiResponse({
      status: 200,
      description: 'Get users has been successfully',
      type: [User],
    })
    @ApiResponse({
      status: 400,
      description: 'Inavlid credencials',
    })
    @ApiResponse({
      status: 401,
      description: 'You are not authorized to access this feature'
    })
    @ApiBearerAuth('JWT-auth')
    async users(@Req() request: Request) {
      try {
        const accessToken = request.headers.authorization.replace(
          'Bearer ',
          '',
        );

        const { id } = await this.jwtService.verifyAsync(accessToken);

        const data = await this.userService.findOneBy({id});

        let response: any;
        let users = [];
        if (data.is_admin === 1) {
          response = await this.userService.find();

          for (const i in response) {
            users.push({
              id: response[i].id,
              firs_name: response[i].first_name,
              last_name: response[i].last_name,
              email: response[i].email,
              is_admin: response[i].is_admin,
            });
          };

          return users;
        } else {
          return new Unauthorized();
        };
      } catch (error) {
        throw new UnauthorizedException();
      };
    };

    @Get('admin/user:id')
    @ApiOperation({description: "Search for a specific user with this endpoint. Remember to authorize first."})
    @ApiResponse({
      status: 200,
      description: 'Get user has been successfully',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Inavlid credencials',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
    @ApiBearerAuth('JWT-auth')
    async getUser(
      @Param() param: IdDto,
      @Req() request: Request
      ) {
        try {
          const accessToken = request.headers.authorization.replace(
            'Bearer ',
            '',
          );

          const { id } = await this.jwtService.verifyAsync(accessToken);

          const data = await this.userService.findOneBy({id});

          let response: any;
          if (data.is_admin === 1) {
            response = await this.userService.findOneBy({id: param.id});
            const {
                password,
                ...user
            } = response;

            return user;
          } else {
            return new Unauthorized();
          };
        } catch (error) {
            throw new UnauthorizedException();
        };
    };
}
