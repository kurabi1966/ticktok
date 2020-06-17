import { Message } from 'node-nats-streaming';
import { Subjects, OrderCreatedEvent, Listener } from '@zidny.net/common';

//--------------
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const fetchOrder = await Order.findById(data.id);

    if (fetchOrder) {
      return msg.ack();
    }

    const order = Order.build({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      version: data.version,
      status: data.status,
    });

    await order.save();
    msg.ack();
  }
}
