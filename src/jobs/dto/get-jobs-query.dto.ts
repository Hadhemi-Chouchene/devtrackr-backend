import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export class GetJobsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
