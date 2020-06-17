import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  protected client: Stan; // preinitilized NATS client
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    console.log(`----- Listeneing to >>>> ${this.subject}`);
    try {
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
      console.log('subscription is ready');

      subscription.on('message', (msg: Message) => {
        console.log(
          `----- Message received from >>>> ${this.subject} / ${this.queueGroupName}`
        );

        const parsedData = this.parseMessage(msg);
        this.onMessage(parsedData, msg);
      });
    } catch (error) {
      console.log('------ Error >>>>', error);
    }
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

export { Listener };
