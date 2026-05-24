import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Martinez',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://avatar.com/img.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;
}
