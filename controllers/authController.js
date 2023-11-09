const { User, tokenBlacklistModel, Comment } = require("../models");

const utils = require("../utils");
const { authCookieName } = require("../app-config");

const bsonToJson = (data) => {
  return JSON.parse(JSON.stringify(data));
};
const removePassword = (data) => {
  const { password, __v, ...userData } = data;
  return userData;
};

const register = (req, res, next) => {
  const { firstName, lastName, email, password, repeatPassword } = req.body;

  return User.create({ firstName, lastName, email, password })
    .then((createdUser) => {
      createdUser = bsonToJson(createdUser);
      createdUser = removePassword(createdUser);

      const token = utils.jwt.createToken({ id: createdUser._id });
      if (process.env.NODE_ENV === "production") {
        res.cookie(authCookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie(authCookieName, token, { httpOnly: true });
      }
      res.status(200).send(createdUser);
    })
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        let field = err.message.split("index: ")[1];
        field = field.split(" dup key")[0];
        field = field.substring(0, field.lastIndexOf("_"));
        res
          .status(409)
          .send({ message: `This ${field} is already registered!` });
        return;
      }
      next(err);
    });
};

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      return Promise.all([user, user ? user.matchPassword(password) : false]);
    })
    .then(([user, match]) => {
      if (!match) {
        res.status(401).send({ message: "Wrong email or password." });
        return;
      }
      user = bsonToJson(user);
      user = removePassword(user);

      const token = utils.jwt.createToken({ id: user._id });

      if (process.env.NODE_ENV === "production") {
        res.cookie(authCookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie(authCookieName, token, { httpOnly: true });
      }
      res.status(200).send(user);
    })
    .catch(next);
}

function logout(req, res) {
  const token = req.cookies[authCookieName];

  tokenBlacklistModel
    .create({ token })
    .then(() => {
      res
        .clearCookie(authCookieName)
        .status(204)
        .send({ message: "Logged out!" });
    })
    .catch((err) => res.send(err));
}

function getProfileInfo(req, res, next) {
  const { _id: userId } = req.user;

  User.findOne({ _id: userId }, { password: 0, __v: 0 })
    .then((user) => {
      res.status(200).send(bsonToJson(user));
    })
    .catch((err) => res.send(err));
}

function editProfileInfo(req, res, next) {
  const { _id: userId } = req.user;
  const { firstName, lastName, email } = req.body;

  User.findOneAndUpdate(
    { _id: userId },
    { firstName, lastName, email },
    { runValidators: true, new: true }
  )
    .then((udpatedProfileInfo) => {
      res.status(200).json(bsonToJson(udpatedProfileInfo));
    })
    .catch((err) => res.send(err));
}

function getUserTennisClubsList(req, res, next) {
  const { _id: userId } = req.user;

  User.findById({ _id: userId }, { password: 0, __v: 0 })
    .populate("userTennisClubsList")
    .then((foundUser) => {
      res.status(200).json(foundUser.userTennisClubsList);
    })
    .catch((err) => res.send(err));
}

function getUserBookedCourtsList(req, res, next) {
  const { _id: userId } = req.user;

  User.findById({ _id: userId }, { password: 0, __v: 0 })
    .populate("userBookedCourtsList")
    .then((foundUser) => {
      res.status(200).json(foundUser.userBookedCourtsList);
    })
    .catch((err) => res.send(err));
}

function getUserCommentsList(req, res, next) {
  const { _id: userId } = req.user;

  Comment.find({ commentAuthor: userId })
    .populate({ path: "commentTennisClub", select: "title" })
    .then((foundComments) => {
      res.status(200).json(foundComments);
    })
    .catch((err) => res.send(err));
}

module.exports = {
  login,
  register,
  logout,
  getProfileInfo,
  editProfileInfo,
  getUserTennisClubsList,
  getUserBookedCourtsList,
  getUserCommentsList,
};
