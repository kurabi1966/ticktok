import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@zidny.net/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
