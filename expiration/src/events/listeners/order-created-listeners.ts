import { Listener, OrderCreatedEvent, Subjects } from '@zidny.net/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queue/expiration.queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const orderId = data.id;

    // do we need any kind of validation?
    // if the order already exist in the queue
    // if the orderId is not compatible with the standard
    // if the expiration time is in the past

    // our altimate goal is to create a job and add it to the queue

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Order ${orderId} will be expired in ${delay}`);

    await expirationQueue.add(
      {
        orderId,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
