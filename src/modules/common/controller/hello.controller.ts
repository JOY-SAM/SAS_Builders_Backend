import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HelloEntity } from '../entities/hello.entity';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Hello')
@Controller('hello')
export class HelloController {

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get Hello World message', description: 'Response: HelloEntity' })
    @ApiResponse({ status: 200, description: 'Successful response', type: HelloEntity })
    public getHello(): HelloEntity {
        return new HelloEntity({ message: 'Hello World!' });
    }

}
