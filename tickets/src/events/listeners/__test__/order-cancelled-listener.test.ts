import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@zidny.net/common';
//=====================
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'movie ticket',
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 123.5,
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg, orderId };
};

it('removes order id from a ticket when the order canclled', async () => {
  const { listener, data, ticket, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toBeCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
