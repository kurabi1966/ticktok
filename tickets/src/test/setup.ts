import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import request from 'supertest';
import jwt from 'jsonwebtoken';
//--------------------------------------------------
jest.mock('../nats-wrapper');

// import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthSession(): string[];
      generateId(): string;
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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthSession = () => {
  // [1] Build a JWT payload {id, email}
  const payload = { id: global.generateId(), email: 'test@test.net' };

  // [2] Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // [3] Build session Object. (jwt: MY_JWT)
  const session = { jwt: token };

  // [4] Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // [5] Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // [6] return
  return [`express:sess=${base64}`];

  // Ammar Idea: Signup and get the cookie that contains the jwt from the browser itself.
  // Note that the env.JWT key must be the same

  // return 'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZsWkRCbE1HVmxZalF4TUdGa01EQXhPREE0TXpZd1l5SXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRVNU1EYzFOREk0TW4wLnR2MWUyZWFyTDB2QWNCN0l6YmxITHZxdFM2ejN1RjNlWUJ4MlVHc1h4N0kifQ=='
};

global.generateId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};
