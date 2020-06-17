import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('oreder:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // extract the job payload
  // publish a new message to nats to indicate that the order expired
  console.log(`Order ${job.data.orderId} has expired`);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
