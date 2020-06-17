import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@zidny.net/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data even
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 99.3,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake Message: We need only to create the ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and save a ticket', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object puls message object
  await listener.onMessage(data, msg);
  // write an assertions to make sure that a ticket was created.
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(0);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object puls message object
  await listener.onMessage(data, msg);
  // write assertion to mak sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
