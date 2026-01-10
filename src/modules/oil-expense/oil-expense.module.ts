import { Module } from '@nestjs/common';
import { OilExpenseController } from './oil-expense.controller';
import { OilExpenseService } from './oil-expense.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [OilExpenseController],
  providers: [OilExpenseService],
})
export class OilExpenseModule {}
