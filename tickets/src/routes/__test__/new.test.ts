import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
  // print 201 before adding authentication & 401 after adding authentication
});

it('can be only accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('allow accesse if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title', price: '123' })
    .expect(201);
});

it('returns an error if an invalied title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: '', price: 123 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if an invalied price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title' })
    .expect(400);
});

it('returns an error if an empty price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title', price: '' })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title' })
    .expect(400);
});

it('creates a ticket if it provided with valied inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title', price: 123.5 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('ticket title');
  expect(tickets[0].price).toEqual(123.5);
});

it('has version 0 for the newelly created ticket', async () => {
  const { body: ticket } = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: 'ticket title', price: 123.5 })
    .expect(201);
  expect(ticket.version).toEqual(0);
});

it('publish an event', async () => {
  const ticketTitle = 'ticket title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title: ticketTitle, price: 100 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
// Template:
// it('', async() =>{

// })
