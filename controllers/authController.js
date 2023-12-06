const { User, tokenBlacklistModel } = require("../models");

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
  const { firstName, lastName, email, password } = req.body;

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
        res.cookie(authCookieName, token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
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

module.exports = {
  login,
  register,
  logout,
};
