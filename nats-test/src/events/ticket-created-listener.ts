import { Message } from 'node-nats-streaming';
import Listener from './base-listener';
import { Subjects } from './subjects';

import { TicketCreatedEvent } from './ticket-created-event';

export default class TicketCreatedListener extends Listener<
  TicketCreatedEvent
> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'ticketCreatedGroup';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`Event id: ${msg.getSequence()}, Event Data: \n`, data);
    msg.ack();
  }
}
