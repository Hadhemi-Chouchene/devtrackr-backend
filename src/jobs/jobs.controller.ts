import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
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
}
