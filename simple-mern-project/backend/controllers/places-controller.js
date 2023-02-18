const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Its THE building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "Its THE building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York 10001",
    creator: "u2",
  },
  {
    id: "p3",
    title: "Empire State Building",
    description: "Its THE building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York 10001",
    creator: "u2",
  },
  {
    id: "p4",
    title: "Empire State Building",
    description: "Its THE building",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  console.log(placeId);
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

const updatePlace = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...PLACES.find((e) => e.id === placeId) };
  const placeIndex = PLACES.findIndex((e) => e.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  if (!PLACES.find((e) => e.id === placeId)) {
    throw new HttpError("Could not find place for that id", 404);
  }
  PLACES = PLACES.filter((e) => e.id !== placeId);
  res.status(200).json({ message: "Deleted Place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
