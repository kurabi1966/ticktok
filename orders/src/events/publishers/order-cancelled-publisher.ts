import { Subjects, Publisher, OrderCancelledEvent } from '@zidny.net/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
