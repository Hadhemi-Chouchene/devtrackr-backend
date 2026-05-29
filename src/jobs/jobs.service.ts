import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { SortOrder } from './dto/get-jobs-query.dto';
import { JobStatus } from './enums/job-status.enum';
import { JobStats } from './types/job-stats.interface';
import dayjs from 'dayjs';
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
      status: status || JobStatus.APPLIED,

      // Link job to the user who created it (from JWT)
      userId: new Types.ObjectId(userId),
    });

    // Save job to MongoDB and return the saved document
    return newJob.save();
  }

  async findAllByUser(userId: string, query: GetJobsQueryDto) {
    // Destructure query parameters with default values
    const { page = '1', limit = '10', status, search, sort } = query;

    // Convert page and limit to numbers and ensure they are positive integers
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    // Limit the maximum number of items per page to prevent abuse (e.g., limit to 50)
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    // Calculate how many documents to skip based on current page and limit
    const skip = (pageNumber - 1) * limitNumber;

    // Build a query filter to find jobs that belong to the authenticated user
    const filter: FilterQuery<JobDocument> = {
      userId: new Types.ObjectId(userId),
    };

    // If a status filter is provided, add it to the query filter
    if (status) {
      filter.status = status;
    }

    // If a search term is provided, add a case-insensitive regex filter for title and company fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption = sort === SortOrder.ASC ? 1 : -1; // Default to descending if not specified

    // Query the database for jobs that belong to the authenticated user, applying pagination and optional status filtering
    const jobs = await this.jobModel
      .find(filter)
      .select('-__v') // Exclude the __v field from results
      .sort({ createdAt: sortOption })
      .skip(skip)
      .limit(limitNumber)
      .lean()
      .exec();

    // Get the total count of jobs that match the filter (for pagination metadata)
    const total = await this.jobModel.countDocuments(filter);
    // Calculate total pages based on total count and limit per page
    const totalPages = Math.ceil(total / limitNumber);
    // Determine if there is a next page based on current page number and total pages
    const hasNextPage = pageNumber < totalPages;
    // Determine if there is a previous page based on current page number
    const hasPreviousPage = pageNumber > 1;
    return {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      jobs,
    };
  }

  // Update a job only if it belongs to the authenticated user
  async editJob(jobId: string, updateData: UpdateJobDto, userId: string) {
    // Find the job by ID and ensure it belongs to the authenticated user
    const job = await this.jobModel.findOneAndUpdate(
      { _id: jobId, userId: new Types.ObjectId(userId) },
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
      userId: new Types.ObjectId(userId),
    });

    // Prevent deleting jobs that don't belong to user
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async findAll(query: GetJobsQueryDto) {
    const { page = '1', limit = '10' } = query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const skip = (pageNumber - 1) * limitNumber;

    const jobs = await this.jobModel
      .find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean()
      .exec();

    const total = await this.jobModel.countDocuments();
    const totalPages = Math.ceil(total / limitNumber);

    return {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      jobs,
    };
  }

  async getStats(userId: string) {
    const stats = await this.jobModel.aggregate<JobStats>([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    const result: Record<JobStatus, number> = {
      [JobStatus.APPLIED]: 0,
      [JobStatus.INTERVIEW]: 0,
      [JobStatus.REJECTED]: 0,
      [JobStatus.ACCEPTED]: 0,
    };

    let total = 0;
    stats.forEach((stat) => {
      result[stat._id] = stat.count;
      total += stat.count;
    });
    return {
      total,
      statuses: result,
    };
  }

  async getMonthlyApplications(userId: string) {
    const monthlyApplications = await this.jobModel.aggregate<{
      _id: { year: number; month: number };
      count: number;
    }>([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
      {
        $limit: 6,
      },
    ]);
    console.log('monthlyApplications: ', monthlyApplications);
    return monthlyApplications
      .map((item) => {
        const date = dayjs()
          .month(item._id.month - 1)
          .year(item._id.year)
          .format('MMM YYYY');

        return {
          month: date,
          count: item.count,
        };
      })
      .reverse();
  }
}
