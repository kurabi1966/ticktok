import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  NotFoundError,
} from '@zidny.net/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    // [1] find the ticket
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: data.id });
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
