import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Software Engineer' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Google' })
  company!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Applied for the software engineer position at Google',
  })
  description?: string;

  @IsString()
  @IsOptional()
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
