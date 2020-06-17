import request from 'supertest';

import { app } from '../../app';

it('fetch a list of tickets', async () => {
  // create few tickets
  const tickets = [
    { title: 'ticket 1', price: 10.9, userId: global.generateId() },
    { title: 'ticket 2', price: 56.0, userId: global.generateId() },
    { title: 'ticket 3', price: 3.25, userId: global.generateId() },
    { title: 'ticket 4', price: 12, userId: global.generateId() },
    { title: 'ticket 5', price: 21.3, userId: global.generateId() },
  ];

  for (let ticket of tickets) {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.getAuthSession())
      .send(ticket)
      .expect(201);
  }

  const response = await request(app).get('/api/tickets').send();
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(tickets.length);
});

it('fetch an empty list of tickets if there is not tickets in the database', async () => {
  const response = await request(app).get('/api/tickets').send();
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(0);
});
