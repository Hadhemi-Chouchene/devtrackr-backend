import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
