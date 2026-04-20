import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Protect this route: only users with valid JWT can access
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(
    @CurrentUser() user: { userId: string },
    @Body() createJobDto: CreateJobDto,
  ) {
    const job = await this.jobsService.create(createJobDto, user.userId);

    return {
      message: 'Job created successfully',
      job,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getJobs(
    @CurrentUser() user: { userId: string },
    @Query() query: GetJobsQueryDto,
  ) {
    const jobs = await this.jobsService.findAllByUser(user.userId, query);

    return {
      message: 'Jobs fetched successfully',
      data: jobs,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editJob(
    @CurrentUser() user: { userId: string },
    @Param('id') jobId: string,
    @Body() updateData: UpdateJobDto,
  ) {
    const updatedJob = await this.jobsService.editJob(
      jobId,
      updateData,
      user.userId,
    );

    return {
      message: 'Job updated successfully',
      job: updatedJob,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(
    @CurrentUser() user: { userId: string },
    @Param('id') jobId: string,
  ) {
    await this.jobsService.deleteJob(jobId, user.userId);

    return {
      message: 'Job deleted successfully',
    };
  }
}
