import { Module } from '@nestjs/common';
import { PrismaStudioController } from './prisma-studio.controller';

@Module({
  controllers: [PrismaStudioController],
})
export class PrismaStudioModule {}
