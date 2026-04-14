import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateJobDTO } from './dto/create-job.dto';
import { JobDocument } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(
    // Inject the Mongoose model for Job schema
    private jobModel: Model<JobDocument>,
  ) {}

  async create(createJobDTO: CreateJobDTO, userId: string) {
    // Destructure incoming DTO (validated input from controller)
    const { title, company, description, location, status } = createJobDTO;

    // Create a new job document and attach the authenticated user's ID
    const newJob = new this.jobModel({
      title,
      company,
      description,
      location,

      // If status is not provided, default to "applied"
      status: status || 'applied',

      // Link job to the user who created it (from JWT)
      userId,
    });

    // Save job to MongoDB and return the saved document
    return newJob.save();
  }
}
