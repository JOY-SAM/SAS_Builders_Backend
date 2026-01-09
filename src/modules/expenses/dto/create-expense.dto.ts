import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 1, description: 'User ID associated with the expense' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID associated with the expense' })
  vehicleId: number;

  @ApiProperty({ example: 1, description: 'Category of the expense' })
  category: number;

  @ApiProperty({ example: 150.50, description: 'Amount of the expense' })
  amount: number;

  @ApiProperty({ example: 'Fuel refill', description: 'Description of the expense' })
  description: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Time of the expense', required: false })
  expenseTime?: string;
}
