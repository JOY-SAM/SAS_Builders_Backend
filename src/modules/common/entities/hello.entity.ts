import { ApiProperty } from '@nestjs/swagger';

export class HelloEntity {

    @ApiProperty({ description: 'The hello world message', example: 'Hello World!' })
    public message: string;

    constructor(partial: Partial<HelloEntity>) {
        Object.assign(this, partial);
    }
}
