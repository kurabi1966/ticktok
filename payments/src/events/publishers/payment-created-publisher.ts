import { Publisher, Subjects, PaymentCreatedEvent } from '@zidny.net/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
