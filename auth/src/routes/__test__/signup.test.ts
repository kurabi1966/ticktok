import request from 'supertest';
//-------------------------------
import { app } from '../../app';

it('return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('return a 400 when passing an invalied email while signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abc', password: 'password' })
    .expect(400);
});

it('return a 400 when passing a short password while signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.net', password: '1' })
    .expect(400);
});

it('return a 400 when passing a long password while signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.net', password: '123456789123456789000' })
    .expect(400);
});

it('return a 400 when missing email and/or password while signup', async () => {
  await request(app).post('/api/users/signup').send({}).expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'abcd' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await global.signup(); // user email is test@test.com

  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'abcde' })
    .expect(400);
});

it('sets a cokkie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('stores the email of the user in lowecase charachters', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({ email: 'Test@tEst.com', password: 'password' })
    .expect(201);
  const cookie = signupResponse.get('Set-Cookie');

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});
