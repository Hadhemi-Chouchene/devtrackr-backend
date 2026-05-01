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
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import type { AuthenticatedUser } from 'src/auth/types/authenticated-user.interface';
@UseGuards(JwtAuthGuard) // Apply JWT guard globally to all routes
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Users can create their own jobs
  @Post()
  async createJob(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createJobDto: CreateJobDto,
  ) {
    const job = await this.jobsService.create(createJobDto, user.userId);

    return {
      message: 'Job created successfully',
      job,
    };
  }

  // Users get ONLY their own jobs
  @Get()
  async getJobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetJobsQueryDto,
  ) {
    const jobs = await this.jobsService.findAllByUser(user.userId, query);

    return {
      message: 'Jobs fetched successfully',
      data: jobs,
    };
  }

  // Users can update ONLY their own jobs (already protected in service)
  @Put(':id')
  async editJob(
    @CurrentUser() user: AuthenticatedUser,
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

  // Users can delete ONLY their own jobs
  @Delete(':id')
  async deleteJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') jobId: string,
  ) {
    await this.jobsService.deleteJob(jobId, user.userId);

    return {
      message: 'Job deleted successfully',
    };
  }

  // ADMIN-ONLY: Get ALL jobs (global access)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  async getAllJobsForAdmin(@Query() query: GetJobsQueryDto) {
    const jobs = await this.jobsService.findAll(query);

    return {
      message: 'All jobs fetched (admin)',
      jobs,
    };
  }
}
