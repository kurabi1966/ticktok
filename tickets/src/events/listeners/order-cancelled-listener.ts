import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
} from '@zidny.net/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    // [1] find the ticket
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    /// what will hapen to the version of the ticket.. we will need to emit an event that the ticket has been updated.com

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
