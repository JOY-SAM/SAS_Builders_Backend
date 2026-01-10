import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../../common/flow/joi-validation.pipe';

@Injectable()
export class UpdateOilIntervalPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object({
            oilChangeInterval: Joi.number().min(1).required().messages({
                'number.base': 'Oil change interval must be a number',
                'number.min': 'Oil change interval must be greater than 0',
                'any.required': 'Oil change interval is required',
            }),
        });
    }
}
