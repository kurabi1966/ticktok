import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@zidny.net/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const createlistener = new TicketCreatedListener(natsWrapper.client);
  const updatelistener = new TicketUpdatedListener(natsWrapper.client);
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

  return { createlistener, updatelistener, data, msg };
};

it('creates and save a ticket, then update and check if the ack has been called twice', async () => {
  const { createlistener, updatelistener, data, msg } = await setup();
  // call the onMessage function with the data object puls message object
  await createlistener.onMessage(data, msg);
  data.title = 'new title';
  data.version = 1;
  await updatelistener.onMessage(data, msg);
  // write an assertions to make sure that a ticket was created.

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual('new title');
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(1);
  expect(msg.ack).toHaveBeenCalledTimes(2);
});

it('refuses to ack the message if the version is not insync', async () => {
  const { createlistener, updatelistener, data, msg } = await setup();
  // call the onMessage function with the data object puls message object
  await createlistener.onMessage(data, msg);
  data.title = 'new title';
  data.version = 2;
  try {
    await updatelistener.onMessage(data, msg);
  } catch (error) {
    expect(error).toBeDefined();
  }

  // write an assertions to make sure that a ticket was created.

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual('ticket title');
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(0);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});
