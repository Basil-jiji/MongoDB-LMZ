import mongoose from 'mongoose';
import HttpError from '../middleware/httpError.js';
import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import Place from '../models/placeModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find({});
  res.json(places);
});

const getPlaceById = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.pid);

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
});

const getPlaceByUserId = asyncHandler(async (req, res, next) => {
  const userWithPlaces = await User.findById(req.params.uid).populate('places');

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getter: true })
    ),
  });
});

const createPlace = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  }

  const { title, description, address, creator } = req.body;

  const createPlace = new Place({
    title,
    description,
    address,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  });
  const user = await User.findById(creator);

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }
  console.log(user);

  const sess = await mongoose.startSession();
  sess.startTransaction();
  await createPlace.save({ session: sess });
  user.places.push(createPlace);
  await user.save({ session: sess });
  await sess.commitTransaction();
  res.status(201).json({ place: createPlace });
});

const updatePlace = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    );
  }
  const { title, description } = req.body;
  const place = await Place.findById(req.params.pid);
  place.title = title;
  place.description = description;
  await place.save();
  res.status(200).json({ place: place.toObject({ getter: true }) });
});

const deletePlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.pid).populate('creator');
  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await place.deleteOne({ session: sess });
  place.creator.places.pull(place);
  await place.creator.save({ session: sess });
  await sess.commitTransaction();
  res.status(200).json({ message: 'Deleted Place' });
});

export {
  getPlaces,
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
