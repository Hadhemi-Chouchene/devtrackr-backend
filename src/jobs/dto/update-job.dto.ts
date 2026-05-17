import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Software Engineer' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Google' })
  company?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Applied for the software engineer position at Google',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Mountain View, CA' })
  location?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  @ApiPropertyOptional({
    example: JobStatus.APPLIED,
    enum: JobStatus,
    description: 'Current application status',
  })
  status?: JobStatus;
}
