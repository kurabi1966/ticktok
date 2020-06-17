import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from '../src/nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KET must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to tickets-mongo database on port 27017');
  } catch (error) {
    console.error('Could not connect to tickets-mongo database.');
  }

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
  new OrderCancelledListener(natsWrapper.client).listen();

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  app.listen(3000, () => {
    console.log('tickets Micro Service started on port 3000.');
  });
};

start();
