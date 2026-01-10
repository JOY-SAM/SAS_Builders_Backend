import { ApiProperty } from '@nestjs/swagger';

class HealthIndicatorStatus {
  @ApiProperty({ example: 'up', description: 'Status of the indicator' })
  status: string;

  [key: string]: any;
}

export class HealthEntity {
  @ApiProperty({ example: 'ok', description: 'Overall status of the application' })
  status: string;

  @ApiProperty({ description: 'Details of each health indicator', type: 'object' })
  info: Record<string, HealthIndicatorStatus>;

  @ApiProperty({ description: 'Error details of each health indicator', type: 'object' })
  error: Record<string, HealthIndicatorStatus>;

  @ApiProperty({ description: 'Combined details of each health indicator', type: 'object' })
  details: Record<string, HealthIndicatorStatus>;
}
