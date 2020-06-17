import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // the idea of this test is to add new ticket, then fetch it twice using 2 referances, then update each instance and save the first one then save the second one. Second save should throw an error becouse:
  // [first instance save] ticket version is 0... first instance will have the instruction of updating version 0 to 1.
  // [second instance save] ticket version is 0... (becouse of the previous save). Second instance will try to save, but will fail becouse it is expecting to update version zero to one, but will find that the current version of the ticket is alread one.
  const ticket = Ticket.build({
    title: 'original ticket title',
    price: 123.4,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 12 });
  secondInstance!.set({ price: 20 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'original ticket title',
    price: 123.4,
    userId: '123',
  });
  await ticket.save();

  expect(ticket.version).toEqual(0);
  await ticket.save();

  expect(ticket.version).toEqual(1);
  await ticket.save();

  expect(ticket.version).toEqual(2);
});
