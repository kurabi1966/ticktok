import { Request, Response, NextFunction } from 'express';
// ----------------------------------

export const logReqUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(`auth: ${req.url}`);
  next();
};
