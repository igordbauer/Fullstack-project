const uuid = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    const error = new HttpError("Cannot fetch the users", 500);
    return next(error);
  }
  res.json({ users: users.map((e) => e.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new HttpError("Invalid inputs passed", 422);
    return next(error);
  }
  const { name, email, password } = req.body;

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }
  if (identifiedUser) {
    const error = new HttpError("This user already exists", 422);
    return next(error);
  }

  const createUser = new User({
    name,
    email,
    image: "https://tinypng.com/images/social/website.jpg",
    password,
    places: [],
  });

  try {
    await createUser.save();
  } catch (e) {
    const error = new HttpError("Signing up failed, please try again");
    return next(error);
  }

  res.status(201).json({ user: createUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email });
  } catch (e) {
    const error = new HttpError("Login in failed", 500);
    return next(error);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Could not identify this user, credentials seem wrong!",
      401
    );
    return next(error);
  }
  res.json({
    message: "Logged in",
    user: identifiedUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
