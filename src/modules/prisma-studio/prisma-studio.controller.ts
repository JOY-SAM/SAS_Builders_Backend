import { Controller, Post, Res, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { createPrismaPostgresHttpClient } from '@prisma/studio-core/dist/data/ppg';
import { serializeError } from '@prisma/studio-core/dist/data/bff';
import { Response } from 'express';



@ApiTags('Prisma Studio')
@Controller('studio')
@ApiBearerAuth()
export class PrismaStudioController {
  @Post()
  @ApiOperation({ summary: 'Execute Prisma Studio queries', description: 'Endpoint for embedded Prisma Studio backend.' })
  @ApiBody({ schema: { type: 'object', properties: { query: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Query executed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async handleStudioRequest(@Body() body: any, @Res() res: Response) {
    const { query } = body;
    const url = process.env.DATABASE_URL;

    if (!url) {
        return res.status(500).json([serializeError(new Error('DATABASE_URL not configured'))]);
    }

    try {
        const [error, results] = await createPrismaPostgresHttpClient({ url }).execute(query);
        
        if (error) {
            return res.status(200).json([serializeError(error)]);
        }
        return res.status(200).json([null, results]);
    } catch (e) {
         return res.status(500).json([serializeError(e)]);
    }
  }
}
