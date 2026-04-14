import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum JobStatus {
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export class CreateJobDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: 'applied' | 'interview' | 'rejected' | 'accepted';
}
