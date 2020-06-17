import request from 'supertest';
//-------------------------------
import { app } from '../../app';

it('it returns 200 in a succesful signin', async () => {
  const user = { email: 'test@test.com', password: 'password' };
  await request(app).post('/api/users/signup').send(user).expect(201);
  await request(app).post('/api/users/signin').send(user).expect(200);
});

it('it set a Set-Cookie in a succesful signin', async () => {
  await global.signup();
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns 400 when missing email and / or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.net' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
  await request(app).post('/api/users/signup').send({}).expect(400);
});

it('returns 400 when passing invalied email ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'abc' })
    .expect(400);
});

it('returns 400 if the user is not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'nonexistinguser@test.com', password: 'password' })
    .expect(400);
});

it('returns 400 if the password is not correct', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'incorrect' })
    .expect(400);
});
