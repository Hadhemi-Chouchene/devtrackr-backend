import { JobStatus } from '../enums/job-status.enum';

export interface JobStats {
  _id: JobStatus;
  count: number;
}
