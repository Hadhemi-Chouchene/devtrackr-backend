import { Controller, Get, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getJobs() {
    return { message: 'GET ALL JOBS' };
  }
}
