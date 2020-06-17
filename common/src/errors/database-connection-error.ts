import { CustomeError } from './custome-error';

export class DatabaseConnectionError extends CustomeError {
  statusCode = 500;
  constructor() {
    super('Error connecting to database');
  }
  serializeErrors = () => {
    return [{ message: 'Error connecting to database' }];
  };
}
