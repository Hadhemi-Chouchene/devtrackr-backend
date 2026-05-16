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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@UseGuards(JwtAuthGuard) // Apply JWT guard globally to all routes
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201 })
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

  @ApiOperation({ summary: 'Get logged-in user jobs' })
  @ApiResponse({ status: 200 })
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

  @ApiOperation({ summary: 'Update a job by id' })
  @ApiResponse({ status: 200 })
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

  @ApiOperation({ summary: 'Delete a job by id' })
  @ApiResponse({ status: 200 })
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

  @ApiOperation({ summary: 'Get all jobs (admin only)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/jobs')
  async getAllJobsForAdmin(@Query() query: GetJobsQueryDto) {
    const jobs = await this.jobsService.findAll(query);

    return {
      message: 'All jobs fetched (admin)',
      jobs,
    };
  }
}
