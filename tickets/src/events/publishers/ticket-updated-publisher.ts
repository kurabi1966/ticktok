import { Publisher, TicketUpdatedEvent, Subjects } from '@zidny.net/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
