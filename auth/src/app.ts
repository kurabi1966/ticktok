import experss from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
//----------------------------------

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@zidny.net/common';
// import { logReqUrl } from '@zidny.net/common';

const app = experss();
app.set('trust proxy', true);
// app.use(logReqUrl);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUserRouter); // route /api/users/currentuser
app.use(signinRouter); // route /api/users/signin
app.use(signoutRouter); // route /api/users/signout
app.use(signupRouter); // route /api/users/signup

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
