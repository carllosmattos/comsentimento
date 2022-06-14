import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches('password')
  password_confirm: string;

  @IsEnum([0, 1])
  is_admin: number
};

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;
};

export class ResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches('password')
  password_confirm: string;
}

export class EmailDto{
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class IdDto{
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
