import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('return a 404 if the provided id does not exist', async () => {
  const id = global.generateId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getAuthSession())
    .send({ title: 'new title' })
    .expect(404);
});

it('it returns a 401 if the user is not authenticated', async () => {
  const id = global.generateId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'new title' })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // Create a ticket
  const ticket = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthSession())
    .send(ticket)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.getAuthSession())
    .send({ title: 'new title' })
    .expect(401);
});

it('return a 400 if the user provide invalied price or title', async () => {
  // Create a ticket
  const ticket = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const cookie = global.getAuthSession();
  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: -10 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 25 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ price: -25 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: '' })
    .expect(400);
});

it('update a ticket if the the user is the owner and the provided fields are correct and the ticket exist', async () => {
  // Create a ticket
  const ticket = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const cookie = global.getAuthSession();
  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  const updatedTicket = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: 432.1 })
    .expect(200);

  expect(updatedTicket.body.title).toEqual('Updated title');
  expect(updatedTicket.body.price).toEqual(432.1);
});

it('rejects updateing the ticket if it is locked', async () => {
  // Create a ticket
  const ticket_data = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const cookie = global.getAuthSession();
  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket_data)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  const ticket = await Ticket.findById(ticketId);
  ticket!.set({ orderId: global.generateId() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: 432.1 })
    .expect(400); // bad request
});

it('update a ticket title only', async () => {
  // Create a ticket
  const ticket = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const cookie = global.getAuthSession();
  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  const updatedTicket = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title' })
    .expect(200);

  expect(updatedTicket.body.title).toEqual('Updated title');
  expect(updatedTicket.body.price).toEqual(123.4);
});

it('increment version of the ticket after updating it', async () => {
  const cookie = global.getAuthSession();
  const { body: ticket } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'ticket title', price: 123.5 })
    .expect(201);
  expect(ticket.version).toEqual(0);

  const { body: first_updated_ticket } = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updated ticket title', price: 321.5 })
    .expect(200);
  expect(first_updated_ticket.version).toEqual(1);

  const { body: second_updated_ticket } = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new updated ticket title', price: 110.5 })
    .expect(200);
  expect(second_updated_ticket.version).toEqual(2);
});

it('publishes an event', async () => {
  // Create a ticket
  const ticket = {
    title: 'ticket one',
    price: 123.4,
    userId: global.generateId(),
  };

  const cookie = global.getAuthSession();
  const reposnse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket)
    .expect(201);

  // Get the id of the ticket
  const ticketId = reposnse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Updated title', price: 432.1 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
