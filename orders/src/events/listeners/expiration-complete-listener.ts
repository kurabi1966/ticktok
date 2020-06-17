import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus,
} from '@zidny.net/common';

import { Message } from 'node-nats-streaming';
//--------------

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExperationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // onMessage will be called whenever some other service publish a message of type ExpirationCompleteEvent
    // The main goal of this function is to set the status of an order to cancel becouse it reaches the allowed time with a payment from the order user.
    // This message will recive the data param that contain the order id
    // so we need to fetch the order from the database
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    // Publish an event that the order has been canceled, so tickets microservice will unlock the ticket

    // We need an instance of OrderCancelledPublisher
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
