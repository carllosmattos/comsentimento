import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IsFile } from "src/interfaces/file.interface";

export class IdDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
};

export class File {
  @IsString()
  filename: string;
};

export class UploadFileDto {
  @IsFile({ mime: ['image/pdf'] })
  file: File;
  filename: any;
};

export enum Status {
  OPEN = 1,
  CLOSE = 0
}

export class UploadDto {
  @IsString()
  title: string

  @IsString()
  description: string;
};

export class EditedDto {
  @IsString()
  title: string

  @IsString()
  description: string;

  @IsEnum({
    type: 'enum',
    enum: Status,
    default: Status
  })
  status: string
};

export class PostResponseDto {
  @IsUUID()
  id: string

  @IsUUID()
  owner: string

  @IsString()
  edited_by: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  file_name: string

  @IsEnum({
    type: 'enum',
    enum: Status,
    default: Status
  })
  status: string
};

export class ListPostResponseDto {
  @IsUUID()
  id: string

  @IsUUID()
  owner: string

  @IsString()
  edited_by: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  file_name: string

  @IsEnum({
    type: 'enum',
    enum: Status,
    default: Status
  })
  status: string

  @IsDate()
  created_at: string

  @IsDate()
  updated_at: string
};
