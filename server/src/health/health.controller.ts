import { Controller, Get } from '@nestjs/common';

// A simple health check controller
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
