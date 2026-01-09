import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the driver', required: false })
  name?: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the driver', required: false })
  phoneNumber?: string;
}
