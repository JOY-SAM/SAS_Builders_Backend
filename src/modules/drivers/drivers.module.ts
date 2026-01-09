import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
