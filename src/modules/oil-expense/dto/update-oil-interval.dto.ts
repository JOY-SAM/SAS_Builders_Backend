import { ApiProperty } from '@nestjs/swagger';

export class UpdateOilIntervalDto {
  @ApiProperty({
    description: 'The oil change interval in hours',
    example: 300,
  })
  oilChangeInterval: number;
}
