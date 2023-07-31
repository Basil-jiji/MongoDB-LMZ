import { validationResult } from 'express-validator';
import HttpError from '../middleware/httpError.js';
import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}, '-password');
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});

const signup = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    const error = new HttpError(
      'Could not create user, email already exists.',
      422
    );
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    places: [],
  });

  await createdUser.save();
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
  }

  res.json({ message: 'Logged in!' });
});

export { getUsers, signup, login };
