import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateJobDTO } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Protect this route: only users with valid JWT can access
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(
    @CurrentUser() user: { userId: string },
    @Body() createJobDTO: CreateJobDTO,
  ) {
    const job = await this.jobsService.create(createJobDTO, user.userId);

    return {
      message: 'Job created successfully',
      job,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getJobs(@CurrentUser() user: { userId: string }) {
    const jobs = await this.jobsService.findAllByUser(user.userId);

    return {
      message: 'Jobs fetched successfully',
      jobs,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editJob(
    @CurrentUser() user: { userId: string },
    @Param('id') jobId: string,
    @Body() updateData: Partial<CreateJobDTO>,
  ) {
    const { ...updateFields } = updateData;
    const updatedJob = await this.jobsService.editJob(
      jobId,
      updateFields,
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
