import { CustomeError } from './custome-error';

export class NotFoundError extends CustomeError {
  statusCode = 404;
  constructor() {
    super('Route not found');
  }
  serializeErrors = () => {
    return [{ message: 'Route not found' }];
  };
}
