import { IsOptional, IsNumberString, IsEnum, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export class GetJobsQueryDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '1' })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '10' })
  limit?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  @ApiPropertyOptional({
    example: 'interview',
    enum: JobStatus,
    description: 'Current application status',
  })
  status?: JobStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'google' })
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ example: 'asc', enum: SortOrder })
  sort?: SortOrder;
}
