const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = PLACES.find((e) => e.id == placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const userPlaces = PLACES.filter((e) => e.creator === uid);
  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
  res.json({ userPlaces });
};

const createPlace = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  PLACES.push(createdPlace);
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
