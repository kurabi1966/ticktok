import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '@zidny.net/common';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe');

it('throws not found error if the order not exist', async () => {
  const orderId = global.generateId();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthSession())
    .send({ orderId: orderId, token: 'abc' })
    .expect(404);
});

it('throws Not Authorized Error if the the user who is paying is deferent than the user who created the order.', async () => {
  const orderData = {
    id: global.generateId(),
    userId: global.generateId(),
    version: 0,
    status: OrderStatus.Created,
    price: 90.6,
  };

  const order = Order.build(orderData);
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthSession())
    .send({ orderId: order.id, token: 'abc' })
    .expect(401);
});

it('throws Bad Request Error if the order expired or cancelled.', async () => {
  const userId = global.generateId();
  const cookie = global.getAuthSession(userId);

  const orderData = {
    id: global.generateId(),
    userId: userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 90.6,
  };

  const order = Order.build(orderData);
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token: 'abc' })
    .expect(400);
});

it('throws Bad Request Error if the order completed.', async () => {
  const userId = global.generateId();
  const cookie = global.getAuthSession(userId);

  const orderData = {
    id: global.generateId(),
    userId: userId,
    version: 0,
    status: OrderStatus.Complete,
    price: 90.6,
  };

  const order = Order.build(orderData);
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token: 'abc' })
    .expect(400);
});

it('throws Bad Request Error if payment token is incorrect.', async () => {
  const userId = global.generateId();
  const cookie = global.getAuthSession(userId);
  const orderData = {
    id: global.generateId(),
    userId: userId,
    version: 0,
    status: OrderStatus.Created,
    price: 10,
  };
  const order = Order.build(orderData);
  await order.save();

  const token = 'invalied_token';

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token })
    .expect(400);
});

it('succesflly accept payment if all params are correct.', async () => {
  const price = Math.floor(Math.random() * 100000);
  const userId = global.generateId();
  const cookie = global.getAuthSession(userId);
  const orderData = {
    id: global.generateId(),
    userId: userId,
    version: 0,
    status: OrderStatus.Created,
    price,
  };
  const order = Order.build(orderData);
  await order.save();

  const token = 'tok_visa';

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token })
    .expect(201);

  // get list of lastest transaction
  const transaction = await stripe.charges.list({ limit: 1 });
  const payment = await Payment.findOne({ orderId: order.id });

  expect(transaction.data[0].metadata.orderId).toEqual(order.id);
  expect(transaction.data[0].id).toEqual(payment?.stripeId);
});
