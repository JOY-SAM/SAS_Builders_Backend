import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { PrismaService } from '../provider';
import { HealthGuard } from '../security/health.guard';
import { HealthEntity } from '../entities/health.entity';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Health')
@ApiBearerAuth()
@Controller('health')
export class HealthController {

    public constructor(
        private readonly health: HealthCheckService,
        private readonly database: PrismaHealthIndicator,
        private readonly prisma: PrismaService
    ) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Check application health', description: 'Response: HealthEntity' })
    @ApiResponse({ status: 200, description: 'Application is healthy (HealthEntity)', type: HealthEntity })
    @ApiResponse({ status: 503, description: 'Application is unhealthy (HealthEntity)', type: HealthEntity })
    @UseGuards(HealthGuard)
    public async healthCheck() {

        return this.health.check([
            async () => this.database.pingCheck('database', this.prisma),
            () => ({
                http: {
                    status: 'up',
                    uptime: process.uptime()
                }
            })
        ]);
    }

}
