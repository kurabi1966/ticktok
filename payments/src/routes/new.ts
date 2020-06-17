import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@zidny.net/common';

import { Order } from '../models/order';
import { stripe } from '../stripe';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the order
    // Check that it owned by the current user
    // check that it is not cancelled yet
    const { token, orderId } = req.body;
    const userId = req.currentUser!.id;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order already canclled');
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError('Order already completed');
    }
    let charge;

    try {
      charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: `Ticketting App: OrderID: ${order.id}`,
        metadata: {
          orderId: order.id,
        },
      });
    } catch (error) {
      throw new BadRequestError('Invalied payment token');
    }

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    // Publish Payment Created Event
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      chargeId: charge.id,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
