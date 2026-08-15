import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class GuestLoginDto {
  @IsString()
  @IsOptional()
  username?: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UpdateThemeDto {
  @IsString()
  theme: string;
}

export class UpdateColorModeDto {
  @IsString()
  colorMode: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
