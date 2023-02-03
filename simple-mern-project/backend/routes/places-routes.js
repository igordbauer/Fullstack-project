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
  },
];

router.get("/", (req, res, next) => {
  console.log("get req in places");
  res.json({
    message: "it works",
  });
});
module.exports = router;
