const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  // identify if the user already exists in the database
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

  // create the hashed password and creates the user
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create an user, please try again!",
      500
    );
    return next(error);
  }
  const createUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  // store the user in the database
  try {
    await createUser.save();
  } catch (e) {
    const error = new HttpError("Signing up failed, please try again");
    return next(error);
  }

  // generates the security token
  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, email: createUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again");
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createUser.id, email: createUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  // identify the existing user
  try {
    identifiedUser = await User.findOne({ email });
  } catch (e) {
    const error = new HttpError("Login in failed", 500);
    return next(error);
  }

  if (!identifiedUser) {
    const error = new HttpError(
      "Could not identify this user, credentials seem wrong!",
      403
    );
    return next(error);
  }
  // identify the validity of the password
  let isValidPassword;

  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again!",
      500
    );
    return next(error);
  }
  // Handling the password invalidation error
  if (!isValidPassword) {
    const error = new HttpError(
      "Could not identify this user, credentials seem wrong!",
      401
    );
    return next(error);
  }
  // generates the security token
  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again");
    return next(error);
  }
  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
