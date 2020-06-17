import { Publisher, TicketCreatedEvent, Subjects } from '@zidny.net/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
