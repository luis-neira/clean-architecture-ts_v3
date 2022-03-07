import { ObjectSchema, ValidationError as joiError } from 'joi';

import { Result } from '../../../../../../core/lib/result';
import { ValidationError } from '../../../../../../common/errors';

import { IValidator } from '../../../../../../adapters/controllers/interfaces';

export class JoiValidator implements IValidator {
  private schema: ObjectSchema;

  public constructor(schema: ObjectSchema) {
    this.schema = schema;
  }

  public async validate(payload: Record<string, any>): Promise<Result> {
    try {
      const value = await this.schema.validateAsync(payload, {
        abortEarly: true
      });

      return Result.ok(value);
    } catch (err: any) {
      const error: joiError = err;

      const FIRST_ERROR = 0;
      const errorMessage = error.details[FIRST_ERROR].message;
      return Result.fail(new ValidationError(errorMessage.replace(/"/g, "'")));
    }
  }
}
