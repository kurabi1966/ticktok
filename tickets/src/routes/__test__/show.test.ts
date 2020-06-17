import request from 'supertest';
import mongoose from 'mongoose';

// import { Ticket } from '../../models/ticket';
import { app } from '../../app';

it('has a route handler listening to /api/tickets/:id for get requests', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns 400 if try to a ticket with an invalied id', async () => {
  await request(app).get('/api/tickets/123').send().expect(400);
});

it('returns 200 if the ticket founded', async () => {
  const title = 'final mach bermaling';
  const price = 650.33;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

// it('test', async () => {});
