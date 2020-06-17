import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  BadRequestError,
} from '@zidny.net/common';

import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Title should not be empty'),
    body('price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // ticket not exist
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    // ticket exist but the updater is not the owner
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // if the owner of the ticket is trying to edit the ticket, but the ticket is locked, then we have to throw an error

    if (ticket.orderId) {
      throw new BadRequestError('Ticket you are trying to edit is locked');
    }

    // [1] user authenticated, [2] user is the owner, [3] fields are valied
    ticket.set({ title: req.body.title || ticket.title });
    ticket.set({ price: req.body.price || ticket.price });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
