import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController, HelloController } from './controller';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService, PrismaService } from './provider';

@Module({
    imports: [
        TerminusModule
    ],
    providers: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService
    ],
    exports: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService
    ],
    controllers: [
        HealthController,
        HelloController
    ],
})
export class CommonModule {}
