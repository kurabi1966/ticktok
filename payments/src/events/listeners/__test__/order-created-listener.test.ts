import mongoose from 'mongoose';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderStatus, OrderCreatedEvent } from '@zidny.net/common';
import { OrderCreatedListener } from '../order-created-listener';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 11.8,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('add new order to the orders collection of the payment service', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('return eraly if the order already exist', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  await listener.onMessage(data, msg);
  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(msg.ack).toBeCalledTimes(2);
});
