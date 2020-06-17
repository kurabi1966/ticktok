import { ValidationError } from 'express-validator';
import { CustomeError } from './custome-error';

export class RequestValidationError extends CustomeError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request Parameters');
  }
  serializeErrors = () => {
    const formatedErrors = this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
    return formatedErrors;
  };
}
