import { Request, Response } from 'express';
import { AuthRequest, asyncHandler } from '../middleware/errorHandler';
import Payment from '../models/Payment';
import Subscription from '../models/Subscription';
import Member from '../models/Member';
import { generateTransactionRef } from '../utils/generateMatricule';
import stripe from 'stripe';
import { validationResult } from 'express-validator';

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || '');

export const createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, subscriptionId, paymentMethod } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get member
  const member = await Member.findOne({ where: { userId } });
  if (!member) {
    return res.status(404).json({ message: 'Member profile not found' });
  }

  let stripePaymentIntentId: string | undefined;

  // Create Stripe payment intent if using card/stripe
  if (paymentMethod === 'stripe' || paymentMethod === 'card') {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        memberId: member.id,
        subscriptionId: subscriptionId || 'donation',
      },
    });
    stripePaymentIntentId = paymentIntent.id;
  }

  // Create payment record
  const transactionRef = generateTransactionRef();
  const payment = await Payment.create({
    memberId: member.id,
    subscriptionId: subscriptionId || null,
    amount,
    currency: 'USD',
    paymentMethod,
    stripePaymentIntentId,
    transactionRef,
    status: 'pending',
  });

  res.status(201).json({
    message: 'Payment intent created successfully',
    payment: {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      transactionRef: payment.transactionRef,
      stripePaymentIntentId,
      paymentMethod,
      status: payment.status,
    },
  });
});

export const completePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const { stripePaymentIntentId } = req.body;

  const payment = await Payment.findByPk(paymentId);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Verify Stripe payment if applicable
  if (stripePaymentIntentId) {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(stripePaymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed in Stripe' });
    }
  }

  // Update payment status
  await payment.update({ status: 'completed' });

  // Update subscription status if related
  if (payment.subscriptionId) {
    const subscription = await Subscription.findByPk(payment.subscriptionId);
    if (subscription) {
      await subscription.update({ status: 'paid', receiptNumber: payment.transactionRef });
    }
  }

  res.json({
    message: 'Payment completed successfully',
    payment,
  });
});

export const getPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const member = await Member.findOne({ where: { userId } });
  if (!member) {
    return res.status(404).json({ message: 'Member profile not found' });
  }

  const payments = await Payment.findAll({
    where: { memberId: member.id },
  });

  res.json(payments);
});
