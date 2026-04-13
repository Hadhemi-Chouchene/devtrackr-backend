import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Protect this route: only users with valid JWT can access
  @UseGuards(JwtAuthGuard)
  @Get()
  getJobs(@CurrentUser() user) {
    // The user object comes from JwtStrategy.validate()
    // It is automatically attached to the request by NestJS after token verification

    return {
      message: 'Jobs fetched successfully',
      user,
    };
  }
}
