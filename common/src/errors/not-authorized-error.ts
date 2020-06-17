import { CustomeError } from './custome-error';

export class NotAuthorizedError extends CustomeError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
  }
  serializeErrors = () => {
    return [{ message: 'Not authorized' }];
  };
}
