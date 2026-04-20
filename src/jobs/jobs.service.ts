import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';

@Injectable()
export class JobsService {
  constructor(
    // Inject the Mongoose model for Job schema
    @InjectModel(Job.name)
    private jobModel: Model<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    // Destructure incoming DTO (validated input from controller)
    const { title, company, description, location, status } = createJobDto;

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

  async findAllByUser(userId: string, query: GetJobsQueryDto) {
    // Destructure query parameters with default values
    const { page = '1', limit = '10', status } = query;

    // Convert page and limit to numbers and ensure they are positive integers
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    // Limit the maximum number of items per page to prevent abuse (e.g., limit to 50)
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    // Calculate how many documents to skip based on current page and limit
    const skip = (pageNumber - 1) * limitNumber;

    // Build a query filter to find jobs that belong to the authenticated user
    const filter: FilterQuery<JobDocument> = { userId };

    // If a status filter is provided, add it to the query filter
    if (status) {
      filter.status = status;
    }

    // Query the database for jobs that belong to the authenticated user, applying pagination and optional status filtering
    const jobs = await this.jobModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Get the total count of jobs that match the filter (for pagination metadata)
    const total = await this.jobModel.countDocuments(filter);
    // Calculate total pages based on total count and limit per page
    const totalPages = Math.ceil(total / limitNumber);
    return {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      jobs,
    };
  }

  // Update a job only if it belongs to the authenticated user
  async editJob(jobId: string, updateData: UpdateJobDto, userId: string) {
    // Find the job by ID and ensure it belongs to the authenticated user
    const job = await this.jobModel.findOneAndUpdate(
      { _id: jobId, userId },
      updateData,
      { new: true },
    );
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Update the job with the provided data and return the updated document
    return job;
  }

  // Delete a job only if it belongs to the authenticated user
  async deleteJob(jobId: string, userId: string) {
    const job = await this.jobModel.findOneAndDelete({
      _id: jobId,
      userId,
    });

    // Prevent deleting jobs that don't belong to user
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}
