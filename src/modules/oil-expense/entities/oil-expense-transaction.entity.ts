import { ApiProperty } from '@nestjs/swagger';
import { ExpenseEntity } from '../../expenses/entities/expense.entity';
import { VehicleEntity } from '../../vehicles/entities/vehicle.entity';

export class OilExpenseTransactionEntity {
  @ApiProperty({ description: 'Created expense details', required: false, nullable: true })
  expense?: ExpenseEntity;

  @ApiProperty({ description: 'Updated vehicle details' })
  vehicle: VehicleEntity;
}
