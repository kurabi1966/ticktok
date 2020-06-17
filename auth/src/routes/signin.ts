import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
// ----------------------------------

import { User } from '../models/user';
import { PasswordManager } from '../services/password-manager';
import { validateRequest, BadRequestError } from '@zidny.net/common';

const router = express.Router();
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must suply a password.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // console.log(`auth: ${req.url}`);

    const email = req.body.email.toLocaleLowerCase();
    const password = req.body.password;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // --------- create a JWT
    const userJWT = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    // --------- Store it in the session object
    // @ts-ignore
    req.session = { jwt: userJWT };

    // --------- Send the user object to the front end
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
