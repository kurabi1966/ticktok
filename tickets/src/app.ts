import experss from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
//----------------------------------

import { errorHandler, NotFoundError, currentUser } from '@zidny.net/common';
// import { logReqUrl } from '@zidny.net/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { getTicketsRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
