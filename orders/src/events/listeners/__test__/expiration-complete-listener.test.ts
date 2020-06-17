import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { ExperationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteEvent, OrderStatus } from '@zidny.net/common';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new ExperationCompleteListener(natsWrapper.client);

  // Create new ticket

  const ticketData = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    title: 'movie ticket',
    price: 19,
  };

  const ticket = Ticket.build(ticketData);
  await ticket.save();

  // Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15);
  // Create an order
  const orderData = {
    orderId: mongoose.Types.ObjectId().toHexString(),
    userId: ticketData.userId,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  };

  const order = await Order.build(orderData);
  await order.save();

  const data: ExpirationCompleteEvent['data'] = { orderId: order.id };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it('listen to event ExpirationCompleteEvent and cancel the order', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const canceledOrder = await Order.findById(order.id).populate('ticket');

  expect(canceledOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(msg.ack).toHaveBeenCalled();
});

it('return not found error if order not found', async () => {
  const listener = new ExperationCompleteListener(natsWrapper.client);

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  const orderId = mongoose.Types.ObjectId().toHexString();
  try {
    await listener.onMessage({ orderId }, msg);
  } catch (error) {
    expect(error).toBeDefined();
  }

  expect(msg.ack).not.toHaveBeenCalled();
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});
