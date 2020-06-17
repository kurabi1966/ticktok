import { Message } from 'node-nats-streaming';
import Listener from './base-listener';
import { Subjects } from './subjects';

import { UserCreatedEvent } from './user-created-event';

export default class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = 'queue-group-name';
  onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log(`Event id: ${msg.getSequence()}, Event Data: \n`, data);
    msg.ack();
  }
}
