import experss from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
//----------------------------------

import { errorHandler, NotFoundError, currentUser } from '@zidny.net/common';
import { createChargeRouter } from './routes/new';

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
app.use(currentUser);

// Add routes here
app.use(createChargeRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
