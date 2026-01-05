import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
