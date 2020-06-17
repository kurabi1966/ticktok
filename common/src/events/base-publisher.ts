import { Stan } from 'node-nats-streaming';
import { Subjects } from '../events/subjects';
export interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        console.log(
          `---- Event has been Published >>>> ${this.subject}, data: ${data}`
        );

        !err ? resolve() : reject(err);
      });
    });
  }
}
