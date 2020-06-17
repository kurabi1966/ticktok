import { Request, Response, NextFunction } from 'express';
import { CustomeError } from '../errors/custome-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomeError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  } else {
    // console.error(err);
    return res.status(400).send({ errors: [{ message: err.message }] });
  }
};
