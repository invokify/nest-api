import { Controller, Get, Req } from '@nestjs/common';
import { CustomRequest } from 'src/middleware/auth.middleware';

@Controller('api/profile')
export class ProfileController {
  @Get()
  getProfile(@Req() req: CustomRequest) {
    return req.user; // User is set in the middleware
  }
}
