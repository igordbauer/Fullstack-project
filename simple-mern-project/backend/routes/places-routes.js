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
  const place = PLACES.filter((e) => e.id == placeId)[0];
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const uid = req.params.uid;
  const userPlaces = PLACES.find((e) => e.id === uid);
  res.json({ userPlaces });
});

module.exports = router;
