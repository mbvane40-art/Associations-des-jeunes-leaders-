import { Request, Response } from 'express';
import { AuthRequest, asyncHandler } from '../middleware/errorHandler';
import Subscription from '../models/Subscription';
import Member from '../models/Member';
import { generateReceiptNumber } from '../utils/generateMatricule';
import { validationResult } from 'express-validator';

export const createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, paymentMethod, month, year } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get member
  const member = await Member.findOne({ where: { userId } });
  if (!member) {
    return res.status(404).json({ message: 'Member profile not found' });
  }

  // Create subscription
  const subscription = await Subscription.create({
    memberId: member.id,
    amount,
    currency: 'USD',
    month,
    year,
    paymentMethod,
    status: 'pending',
  });

  res.status(201).json({
    message: 'Subscription created successfully',
    subscription,
  });
});

export const getSubscriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const member = await Member.findOne({ where: { userId } });
  if (!member) {
    return res.status(404).json({ message: 'Member profile not found' });
  }

  const subscriptions = await Subscription.findAll({
    where: { memberId: member.id },
  });

  res.json(subscriptions);
});

export const updateSubscriptionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;
  const { status } = req.body;

  const subscription = await Subscription.findByPk(subscriptionId);
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  await subscription.update({ status });

  res.json({
    message: 'Subscription updated successfully',
    subscription,
  });
});
