import { CustomeError } from './custome-error';

export class BadRequestError extends CustomeError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);
  }
  serializeErrors = () => {
    return [{ message: this.message }];
  };
}
