import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the driver' })
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the driver' })
  phoneNumber: string;
}
