import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  name: string | null;

  @ApiProperty({ description: 'User password', writeOnly: true })
  password: string;

  @ApiProperty({ example: false, description: 'Is user an admin' })
  isAdmin: boolean;

  @ApiProperty({ example: false, description: 'Is user a driver' })
  isDriver: boolean;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  phoneNumber: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Record creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Record last update date' })
  updatedAt: Date;
}
