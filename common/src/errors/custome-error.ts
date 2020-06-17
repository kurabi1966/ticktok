export abstract class CustomeError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    // Only becouse we are extending a built in class
    Object.setPrototypeOf(this, CustomeError.prototype);
  }
  abstract serializeErrors(): { message: string; field?: string }[];
}
