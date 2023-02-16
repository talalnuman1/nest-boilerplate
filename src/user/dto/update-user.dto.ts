import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;


}
