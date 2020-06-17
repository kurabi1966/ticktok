import mongoose from 'mongoose';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderStatus, OrderCancelledEvent } from '@zidny.net/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderData = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 90.6,
  };

  const order = Order.build(orderData);
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('changes the status of an order to be cancelled', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks after updating the order status', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('returns not found error if the order not exist', async () => {
  const { listener, data, msg } = await setup();
  data.id = mongoose.Types.ObjectId().toHexString();
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    expect(error).toBeDefined();
  }
});
