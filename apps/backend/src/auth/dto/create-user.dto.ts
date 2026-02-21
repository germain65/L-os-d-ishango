import { IsEmail, IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Categorie } from '@los-d-ishango/shared';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  pseudo: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsEnum(Categorie)
  categorie: Categorie;
}
