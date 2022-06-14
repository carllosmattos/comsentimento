import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PostService } from './post.service';
import { Status } from './post.entity';
import { EditedDto, IdDto, ListPostResponseDto, PostResponseDto, UploadDto, UploadFileDto } from 'src/dtos/post.dto';

var rimraf = require('rimraf');

const dirnameReplace = __dirname.replace('/dist/post', '');

const uploadDir = dirnameReplace + '/uploads/pdf/'

export const storage = {
  storage: diskStorage({
    destination: './uploads/pdf',
    filename: (req, file, cb) => {
      const extension: string = require('path').extname(file.originalname);
      const name: string = file.originalname.replace(extension, '-') + uuidv4();
      const filename: string = name.replace(/\s/g, '-');

      cb(null, `${filename}${extension}`)
    },
  })
};

@Controller('post')
export class PostController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private postService: PostService
  ) { };

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ description: "Endpoint to post an edict." })
  @ApiResponse({
    status: 200,
    description: 'Announcement sent successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'You are not allowed to post',
  })
  async upload(
    @UploadedFile() file: UploadFileDto,
    @Body() body: UploadDto,
    @Req() request: Request
  ) {
    try {
      const accessToken = request.headers.authorization.replace(
        'Bearer ',
        '',
      );

      const { id } = await this.jwtService.verifyAsync(accessToken);

      const data = await this.userService.findOneBy({ id });

      if (data.is_admin === 1) {
        return this.postService.save({
          owner: data.id,
          edited_by: data.id,
          title: body.title,
          description: body.description,
          file_name: file.filename,
          status: Status.OPEN
        });
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    };
  };

  @Put('edit:id')
  @UseInterceptors(FileInterceptor('file', storage))
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    type: 'uuid'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ description: "Endpoint to edit an edict." })
  @ApiResponse({
    status: 200,
    description: 'Announcement edited successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'You are not allowed to edit',
  })
  async edit(
    @UploadedFile() file: UploadFileDto,
    @Param() param: IdDto,
    @Body() body: EditedDto,
    @Req() request: Request
  ) {
    try {
      const accessToken = request.headers.authorization.replace(
        'Bearer ',
        '',
      );

      const { id } = await this.jwtService.verifyAsync(accessToken);

      const data = await this.userService.findOneBy({ id });

      if (data.is_admin === 1) {
        let post = await this.postService.findOneBy(param.id);

        const update = await this.postService.update(post.id, {
          edited_by: data.id,
          title: body.title,
          description: body.description,
          status: body.status,
          file_name: file.filename
        });

        const newPost = {
          ...post,
          edited_by: data.id,
          title: body.title,
          description: body.description,
          status: body.status,
          file_name: file.filename
        }

        if (update && file.filename) {
          rimraf(`${uploadDir}${post.file_name}`, function (err: string) {
            if (err) {
              console.error(err);
            } else {
              console.log('successfully edited');
            }
          });
        };
        return newPost;
      };
    } catch (error) {
      throw new UnauthorizedException();
    };
  };

  @Delete('delete:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ description: "Endpoint to delete an edict." })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'You are not allowed to delete',
  })
  async delete(
    @Param() param: IdDto,
    @Req() request: Request
  ) {
    try {
      const accessToken = request.headers.authorization.replace(
        'Bearer ',
        '',
      );

      const { id } = await this.jwtService.verifyAsync(accessToken);

      const data = await this.userService.findOneBy({ id });

      if (data.is_admin === 1) {
        const post = await this.postService.findOneBy(param.id);

        const deleted = await this.postService.delete({ id: post.id });

        if (deleted && post.file_name) {
          console.log(`${uploadDir}${post.file_name}`);
          rimraf(`${uploadDir}${post.file_name}`, function (err: string) {
            if (err) {
              console.error(err);
            }
            console.log('successfully deleted');
          });
        };
      };
      return {
        message: 'successfully deleted',
      };
    } catch (error) {
      console.log('error');
      console.log(error);
      throw new UnauthorizedException();
    };
  };

  @Get('list')
  @ApiOperation({ description: "endpoint to view announcement." })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [ListPostResponseDto]
  })
  @ApiResponse({
    status: 400,
    description: 'You are not allowed to post',
  })
  async list() {
    try {
      let response: any;
      let posts = [];
      response = await this.postService.find();
      console.log(response);

      for (const i in response) {
        posts.push({
          id: response[i].id,
          owner: response[i].owner,
          edited_by: response[i].edited_by,
          title: response[i].title,
          description: response[i].description,
          file_name: response[i].file,
          status: response[i].status,
          created_at: response[i].created_at,
          updated_at: response[i].updated_at,
        });
      };
      return posts;
    } catch (error) {
      throw new UnauthorizedException();
    };
  };
};
