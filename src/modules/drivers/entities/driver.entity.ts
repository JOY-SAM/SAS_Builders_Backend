import { ApiProperty } from '@nestjs/swagger';

export class DriverEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier of the driver' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the driver' })
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the driver' })
  phoneNumber: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Record creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Record last update date' })
  updatedAt: Date;
}
