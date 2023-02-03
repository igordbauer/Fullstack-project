const express = require("express");

const router = express.Router();

const USERS = [
  {
    id: "u1",
    name: "igor",
    image:
      "http://s2.glbimg.com/h3Duok3KWVA8yaIOzZZIESkNLC4DKPsVVGWWhNMHhpNIoz-HdGixxa_8qOZvMp3w/e.glbimg.com/og/ed/f/original/2013/08/02/imagem_para_sexta_51.jpg",
    places: 3,
  },
  {
    id: "u2",
    name: "Graci",
    image:
      "http://s2.glbimg.com/h3Duok3KWVA8yaIOzZZIESkNLC4DKPsVVGWWhNMHhpNIoz-HdGixxa_8qOZvMp3w/e.glbimg.com/og/ed/f/original/2013/08/02/imagem_para_sexta_51.jpg",
    places: 3,
  },
];

router.get("/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const user = USERS.find((e) => e.id === userId);

  res.json({ user });
});

module.exports = router;
