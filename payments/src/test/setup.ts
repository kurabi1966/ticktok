import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import request from 'supertest';
import jwt from 'jsonwebtoken';
//--------------------------------------------------
jest.mock('../nats-wrapper');
process.env.STRIPE_KEY =
  'sk_test_51ECVEMGWoubHTSRh0TlHWlHgMFUd9ZbsfgdWzCD0YUrUsAFwVsFldjZDn8GNoxgIh1Bd8mIJoBv7MzpQ7tNVYPgN00r6JVmIuh';
// import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthSession(userId?: string): string[];
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

global.getAuthSession = (userId?: string) => {
  // [1] Build a JWT payload {id, email}

  const payload = { id: userId || global.generateId(), email: 'test@test.net' };

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
};

global.generateId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};
