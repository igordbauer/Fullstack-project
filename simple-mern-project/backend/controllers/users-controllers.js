const uuid = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const USERS = [
  {
    id: "u1",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
  {
    id: "u2",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
  {
    id: "u3",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
  {
    id: "u4",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
  {
    id: "u5",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
  {
    id: "u6",
    name: "Igor",
    email: "igordbauer@gmail.com",
    password: "1234",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const signUp = (req, res, next) => {
  const error = validationResult(req);
  console.log(error);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { name, email, password } = req.body;

  const identifiedUser = USERS.find((e) => e.email === email);
  if (identifiedUser) {
    throw new HttpError("This email already exists!", 422);
  }

  const createUser = {
    id: uuid.v4(),
    name: name,
    email: email,
    password: password,
  };
  USERS.push(createUser);
  res.status(201).json({ user: createUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find((e) => e.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify this user, credentials seem wrong!",
      401
    );
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
