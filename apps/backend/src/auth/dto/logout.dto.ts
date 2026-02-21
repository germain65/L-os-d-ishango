import { IsString, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  logoutAll?: string; // "true" si déconnexion de tous les appareils
}
