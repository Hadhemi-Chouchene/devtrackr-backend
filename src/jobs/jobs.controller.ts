import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Protect this route: only users with valid JWT can access
  @UseGuards(JwtAuthGuard)
  @Get()
  getJobs(@Request() req) {
    // After JWT validation, the user is attached to the request object
    // This comes from JwtStrategy validate() method
    return req.user;
  }
}
