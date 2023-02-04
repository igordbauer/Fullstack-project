const HttpError = require("../models/http-error");
const uuid = require("uuid");

const PLACES = [
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
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = PLACES.find((e) => e.id == placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const userPlaces = PLACES.find((e) => e.creator === uid);
  if (!userPlaces) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
  res.json({ userPlaces });
};

const createPlace = (req, res, next) => {
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
