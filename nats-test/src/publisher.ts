import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedEvent } from './events/ticket-created-event';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();

const stan = nats.connect('ticketing', 'ticketing-publisher', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log(`Publishing to TicketCreatedPublisher`);
  const publisher = new TicketCreatedPublisher(stan);
  const eventToPublish: TicketCreatedEvent['data'] = {
    id: randomBytes(4).toString('hex'),
    title: `ticket title: ${randomBytes(8).toString('hex')}`,
    price: Math.round(Math.random() * 100),
    time: new Date(),
  };
  try {
    await publisher.publish(eventToPublish);
    console.log('publish method of the Publisher base class has been invoked');
  } catch (error) {
    console.error(error);
  }
});
