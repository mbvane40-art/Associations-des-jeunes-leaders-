import { Request, Response } from 'express';
import { AuthRequest, asyncHandler } from '../middleware/errorHandler';
import User from '../models/User';
import Member from '../models/Member';
import { generateMatricule } from '../utils/generateMatricule';
import { validationResult } from 'express-validator';

export const createMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { dateOfBirth, gender, address, phone, profession, photoUrl, idCardUrl } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if member already exists
  const existingMember = await Member.findOne({ where: { userId } });
  if (existingMember) {
    return res.status(400).json({ message: 'Member profile already exists' });
  }

  // Generate unique matricule
  const matricule = generateMatricule();

  // Create member profile
  const member = await Member.create({
    userId,
    matricule,
    dateOfBirth,
    gender,
    address,
    phone,
    profession,
    photoUrl,
    idCardUrl,
    registrationDate: new Date(),
    status: 'active',
  });

  res.status(201).json({
    message: 'Member profile created successfully',
    member: {
      id: member.id,
      matricule: member.matricule,
      userId: member.userId,
      gender: member.gender,
      phone: member.phone,
      profession: member.profession,
      status: member.status,
    },
  });
});

export const getMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const member = await Member.findOne({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
});

export const updateMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { address, phone, profession, photoUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const member = await Member.findOne({ where: { userId } });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  await member.update({
    address: address || member.address,
    phone: phone || member.phone,
    profession: profession || member.profession,
    photoUrl: photoUrl || member.photoUrl,
  });

  res.json({
    message: 'Member updated successfully',
    member,
  });
});

export const getAllMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await Member.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  });

  res.json(members);
});
