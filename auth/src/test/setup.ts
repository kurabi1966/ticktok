import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'consensys';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const user = { email: 'test@test.com', password: 'password' };
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  return signupResponse.get('Set-Cookie');
};
