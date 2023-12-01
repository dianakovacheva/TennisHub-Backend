const { User } = require("../models");

// User Info
function getUserById(req, res, next) {
  const { userId } = req.params;

  User.findOne({ _id: userId }, { password: 0, __v: 0 })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => res.send(err));
}

// Edit User Info
function editUserInfo(req, res, next) {
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

// User Created Clubs
function getUserCreatedClubs(req, res, next) {
  const { _id: userId } = req.user;

  User.findById({ _id: userId }, { password: 0, __v: 0 })
    .populate("userCreatedClubs")
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(foundUser.userCreatedClubs);
    })
    .catch((err) => res.send(err));
}

// User Managed Clubs
function getUserManagedClubs(req, res, next) {
  const { _id: userId } = req.user;

  User.findById({ _id: userId }, { password: 0, __v: 0 })
    .populate("userManagedClubs")
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(foundUser.userManagedClubs);
    })
    .catch((err) => res.send(err));
}

// User Joined Clubs
function getUserJoinedClubs(req, res, next) {
  const { _id: userId } = req.user;

  User.findById({ _id: userId }, { password: 0, __v: 0 })
    .populate("userJoinedClubsList")
    .then((foundUser) => {
      res.status(200).json(foundUser.userJoinedClubsList);
    })
    .catch((err) => res.send(err));
}

module.exports = {
  getUserById,
  editUserInfo,
  getUserCreatedClubs,
  getUserManagedClubs,
  getUserJoinedClubs,
};
