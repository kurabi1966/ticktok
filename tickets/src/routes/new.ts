import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@zidny.net/common';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required field'),
    body('price')
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price is required field and must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const title = req.body.title;
    const price = req.body.price;
    const userId = req.currentUser!.id; // requireAuth provide the currentUser as an object and assotiated it to the request object

    // Create & Save new Ticket
    const ticket = Ticket.build({ title, price, userId });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
