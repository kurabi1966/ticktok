import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

//----------------------------

import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@zidny.net/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const email = req.body.email.toLocaleLowerCase();
    const password = req.body.password;
    // Find a user that has the same email

    if (await User.findOne({ email })) {
      throw new BadRequestError('Email in use');
    }

    // Create & Save new User
    const user = User.build({ email, password });
    await user.save();
    // create a JWT
    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    // Store it in the session object
    // @ts-ignore
    req.session = { jwt: userJWT };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
