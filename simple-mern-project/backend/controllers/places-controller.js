const HttpError = require("../models/http-error");
// const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

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
    userPlaces = await Place.find({ creator: uid });
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
    userPlaces: userPlaces.map((e) => e.toObject({ getters: true })),
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
    image:
      "https://i.pinimg.com/originals/bd/a5/be/bda5be61177acdb5fd46c3219f8b81a0.jpg",
    creator,
  });

  try {
    await createdPlace.save();
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
    place = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError("Could not find the specified place", 404);
    return next(error);
  }
  if (!place) {
    throw new HttpError("Could not find place for that id", 404);
  }
  try {
    place.remove(placeId);
  } catch (e) {
    const error = new HttpError("Could not delete the place", 404);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
