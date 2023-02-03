const express = require("express");

const router = express.Router();

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
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = PLACES.find((e) => e.id == placeId);
  if (!place) {
    const error = new Error("Could not find a place for the provided id");
    error.code = 404;
    throw error;
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const uid = req.params.uid;
  const userPlaces = PLACES.find((e) => e.id === uid);
  if (!userPlaces) {
    const error = new Error("Could not find a place for the provided user id");
    error.code = 404;
    return next(error);
  }
  res.json({ userPlaces });
});

module.exports = router;
