import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@zidny.net/common';
//=====================
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'movie ticket',
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 123.5,
  });

  await ticket.save();

  // create a fake Message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Build fake data object
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 600);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: expiration.toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // return
  return { listener, ticket, data, msg };
};

it('set the user id of the ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('set returns 404 if the ticket not exist', async () => {
  const { listener, data, msg } = await setup();
  data.ticket.id = mongoose.Types.ObjectId().toHexString();
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    expect(error).toBeDefined();
  }
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const publishEventPayload = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(publishEventPayload!.orderId).toEqual(data.id);
});
