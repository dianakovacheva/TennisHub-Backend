const { TennisClub, User, Comment } = require("../models");

// Create Tennis Club
function createTennisClub(req, res) {
  const { name, imageURL, summary, location, contact } = req.body;

  const { _id: userId } = req.user;

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  TennisClub.create({
    name,
    imageURL: convertedImageUrl,
    summary,
    location,
    contact,
    manager: [userId],
  })
    .then((createdTennisClub) => {
      if (createdTennisClub) {
        return Promise.all([
          User.updateOne(
            { _id: userId },
            {
              $push: { userTennisClubsList: createdTennisClub._id },
            }
          ),
        ]).then(res.status(200).json(createdTennisClub));
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get All Tennis Clubs
function getAllTennisClubs(req, res) {
  TennisClub.find()
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundTennisClubs) => {
      if (foundTennisClubs) {
        res.status(200).json(foundTennisClubs);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Tennis Club by ID
function getTennisClubById(req, res, next) {
  const { TennisClubId } = req.params;

  TennisClub.findById(TennisClubId)
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundTennisClub) => {
      if (foundTennisClub) {
        res.status(200).json(foundTennisClub);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Edit Tennis Club
function editTennisClub(req, res) {
  const { TennisClubId } = req.params;
  const { _id: userId } = req.user;
  const { name, imageURL, summary, location, contact } = req.body;

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  TennisClub.findOneAndUpdate(
    { _id: TennisClubId, author: userId },
    {
      name: name,
      imageURL: convertedImageUrl,
      summary: summary,
      location: location,
      contact: contact,
    }
  )
    .then((updatedTennisClub) => {
      if (updatedTennisClub) {
        res.status(200).json(updatedTennisClub);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Delete Tennis Club
function deleteTennisClub(req, res) {
  const { TennisClubId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    TennisClub.findOneAndDelete({ _id: TennisClubId, manager: userId }),
    User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          userTennisClubsList: TennisClubId,
          userBookedCourtsList: TennisClubId,
        },
      }
    ),
    Comment.findOneAndDelete(
      { commentedTennisClub: TennisClubId },
      { $pull: { commentedTennisClub: TennisClubId } }
    ),
  ])
    .then(([deletedOne, _]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Join Tennis Club
function joinTennisClub(req, res, next) {
  const { TennisClubId } = req.params;
  const { _id: userId } = req.user;

  return Promise.all([
    TennisClub.updateOne(
      { _id: TennisClubId },
      { $addToSet: { clubJoinedUsersList: userId } },
      { new: true }
    ),
    User.updateOne(
      { _id: userId },
      {
        $push: { userJoinedTennisClubsList: TennisClubId },
      }
    ),
  ])
    .then(() => {
      res.status(200).json({ message: "Tennis club joined successfully!" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Remove Joined Tennis Club
function removeJoinedTennisClub(req, res, next) {
  const { TennisClubId } = req.params;
  const { _id: userId } = req.user;

  return Promise.all([
    TennisClub.updateOne(
      { _id: TennisClubId },
      { $pull: { clubJoinedUsersList: userId } },
      { new: true }
    ),
    User.updateOne(
      { _id: userId },
      {
        $pull: { userJoinedTennisClubsList: TennisClubId },
      }
    ),
  ])
    .then(() => {
      res.status(200).json({ message: "Tennis club removed successfully!" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Tennis Club Comments
function getTennisClubComments(req, res, next) {
  const { TennisClubId } = req.params;

  Comment.find({ commentedTennisClub: TennisClubId })
    .populate({ path: "commentAuthor", select: "firstName lastName" })
    .then((foundComments) => {
      if (foundComments) {
        res.status(200).json(foundComments);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Search
function search(req, res, next) {
  const query = req.query.search;
  const regExpQuery = new RegExp(query, "i"); // 'i' flag for case-insensitive search

  TennisClub.find({
    $or: [
      { name: regExpQuery },
      { summary: regExpQuery },
      { location: regExpQuery },
    ],
  })
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundTennisClubs) => {
      if (foundTennisClubs) {
        res.status(200).json(foundTennisClubs);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

module.exports = {
  createTennisClub,
  getAllTennisClubs,
  getTennisClubById,
  editTennisClub,
  deleteTennisClub,
  joinTennisClub,
  removeJoinedTennisClub,
  getTennisClubComments,
  search,
};
