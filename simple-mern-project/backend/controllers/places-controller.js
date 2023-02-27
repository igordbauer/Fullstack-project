const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const fs = require("fs");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError("Could not get any place", 404);
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let userPlaces;
  try {
    userPlaces = await User.findById(uid).populate("places");
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not find any place for this user",
      500
    );
    return next(error);
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
  res.json({
    userPlaces: userPlaces.toObject({ getters: true }),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }
  const { title, description, address, creator } = req.body;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (e) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "We could not find any user for the provided id",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Create place failed!", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new HttpError("Invalid inputs passed", 422);
    return next(error);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;

  try {
    updatedPlace = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not find a place to update",
      500
    );
    return next(error);
  }
  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not update the place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (e) {
    const error = new HttpError("Could not find the specified place", 404);
    return next(error);
  }
  if (!place) {
    throw new HttpError("Could not find place for that id", 404);
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (e) {
    const error = new HttpError("Could not delete the place", 500);
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
