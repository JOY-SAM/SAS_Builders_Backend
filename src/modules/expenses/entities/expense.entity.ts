import { ApiProperty } from '@nestjs/swagger';
import { Expense } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ExpenseEntity implements Expense {
  @ApiProperty({ example: 1, description: 'Unique identifier of the expense' })
  id: number;

  @ApiProperty({ example: 1, description: 'User ID associated with the expense' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID associated with the expense' })
  vehicleId: number;

  @ApiProperty({ example: 'Fuel', description: 'Category of the expense' })
  category: string;

  @ApiProperty({ example: 150.50, description: 'Amount of the expense', type: 'number' })
  amount: Decimal;

  @ApiProperty({ example: 'Fuel refill', description: 'Description of the expense' })
  description: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Time of the expense' })
  expenseTime: Date;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Record creation date' })
  createdAt: Date;
}
