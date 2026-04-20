import { IsOptional, IsNumberString, IsEnum, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export enum SrtOrder {
  ASC = 'asc',
  DESC = 'desc',
}
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

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortBy?: SortOrder;
}
