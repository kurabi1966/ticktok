import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { ClientListener } from '../listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

class TicketCtreatedListener extends ClientListener {
  subject = 'ticket:created';
  queueGroupName = 'payment-service';

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: any, msg: Message) {
    console.log('Event data.', data);
    msg.ack();
  }
}

const client = new TicketCtreatedListener(stan);
client.listen();
