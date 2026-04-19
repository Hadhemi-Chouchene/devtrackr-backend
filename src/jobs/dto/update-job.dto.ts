import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';
export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
