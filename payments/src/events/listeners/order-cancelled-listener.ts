import { Message } from 'node-nats-streaming';
import {
  Subjects,
  OrderCancelledEvent,
  Listener,
  NotFoundError,
  OrderStatus,
} from '@zidny.net/common';

//--------------
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    if (
      order.status === OrderStatus.Cancelled ||
      order.status === OrderStatus.Complete
    ) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
