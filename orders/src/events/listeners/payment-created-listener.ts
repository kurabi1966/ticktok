import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@zidny.net/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    // Find the order
    // Check if it is not canclled
    // Update the status to complete
    // Publish OrderUpdated event

    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError('Order has been completed');
    }

    order!.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    // do we need to announce that the order has completed?

    msg.ack();
  }
}
