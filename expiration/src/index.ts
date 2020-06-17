import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listeners';

const start = async () => {
  if (
    process.env.NATS_CLUSTER_ID &&
    process.env.NATS_CLIENT_ID &&
    process.env.NATS_URL
  ) {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
  } else {
    throw new Error(
      'Environment Variables of the NATS cluster should be defined'
    );
  }

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new OrderCreatedListener(natsWrapper.client).listen();
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());
};

start();
