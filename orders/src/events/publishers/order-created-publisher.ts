import { Publisher, OrderCreatedEvent, Subjects } from '@zidny.net/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
