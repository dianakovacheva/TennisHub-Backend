const { Club, User, Comment, Court } = require("../models");

// Create Club
function createClub(req, res) {
  const { name, imageURL, summary, address, phoneNumber, manager } = req.body;

  const { _id: userId } = req.user;

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  Club.create({
    name,
    imageURL: convertedImageUrl,
    summary,
    address,
    phoneNumber,
    manager: userId,
  })
    .then((createdClub) => {
      if (createdClub) {
        return Promise.all([
          User.updateOne(
            { _id: userId },
            {
              $push: {
                userCreatedClubs: createdClub._id,
                userManagedClubs: createdClub._id,
                userJoinedClubs: createdClub._id,
              },
            },
            { new: true }
          ),
          Club.updateOne(
            { _id: createdClub._id },
            { $addToSet: { members: userId } },
            { new: true }
          ),
        ]).then(res.status(200).json(createdClub));
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get All Clubs
function getAllClubs(req, res) {
  Club.find()
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundClubs) => {
      if (foundClubs) {
        res.status(200).json(foundClubs);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Club by Id
function getClubById(req, res, next) {
  const { clubId } = req.params;

  Club.findById(clubId)
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundClub) => {
      if (!foundClub) {
        return res.status(404).json({ message: "Club not found." });
      }
      res.status(200).json(foundClub);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Edit Club
function editClub(req, res) {
  const { clubId } = req.params;
  const { _id: userId } = req.user;
  const { name, imageURL, summary, address, phoneNumber } = req.body;

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  Club.findOneAndUpdate(
    { _id: clubId, manager: userId },
    {
      name: name,
      imageURL: convertedImageUrl,
      summary: summary,
      address: address,
      phoneNumber: phoneNumber,
    }
  )
    .then((updatedClub) => {
      if (updatedClub) {
        res.status(200).json(updatedClub);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Delete Club
function deleteClub(req, res) {
  const { clubId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Club.findOneAndDelete({ _id: clubId, manager: userId, members: userId }),
    User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          userCreatedClubs: clubId,
          userManagedClubs: clubId,
          userJoinedClubs: clubId,
        },
      },
      { new: true }
    ),
    Comment.deleteMany({ commentedClub: clubId }),
    Court.deleteMany({ clubId }),
  ])
    .then(([deletedOne, _, deletedComments, deletedCourts]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne, deletedComments, deletedCourts);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Join Club
function joinClub(req, res, next) {
  const { clubId } = req.params;
  const { _id: userId } = req.user;

  if (req.user.userJoinedClubs.includes(clubId)) {
    return res
      .status(400)
      .json({ message: "User is already a member of the club." });
  }
  return Promise.all([
    Club.updateOne(
      { _id: clubId },
      { $addToSet: { members: userId } },
      { new: true }
    ),
    User.updateOne(
      { _id: userId },
      {
        $push: { userJoinedClubs: clubId },
      },
      { new: true }
    ),
  ])
    .then(([joinedClub]) => {
      if (joinedClub) {
        res.status(200).json({
          message: "User joined the club successfully!",
          joinedClub,
        });
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Leave Club
async function leaveClub(req, res, next) {
  const { clubId } = req.params;
  const { _id: userId } = req.user;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(400).json({ message: "Club not found." });
    }

    const isManager = club.manager.includes(userId);

    if (!isManager) {
      return res
        .status(403)
        .json({ message: "You are not a manager of this club." });
    }

    if (club.manager.length === 1) {
      return res
        .status(403)
        .json({ message: "You are the only manager. Cannot leave the club." });
    }

    return Promise.all([
      Club.updateOne(
        { _id: clubId },
        { $pull: { members: userId } },
        { new: true }
      ),
      User.updateOne(
        { _id: userId },
        { $pull: { userJoinedClubs: clubId } },
        { new: true }
      ),
    ])
      .then(() => {
        res.status(200).json({
          message: `User ${userId} left club ${clubId} successfully!`,
        });
      })
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ message: "An error occurred while leaving the club." });
      });
  } catch (error) {
    console.log(error);
  }
}

// Get Club Members
function getClubMembers(req, res, next) {
  const clubId = req.params.clubId;

  Club.findById(clubId)
    .populate("members")
    .then((foundClub) => {
      if (!foundClub) {
        return res.status(404).json({ message: "Club not found." });
      }
      res.status(200).json(foundClub.members);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Club Courts
function getClubCourts(req, res, next) {
  const { clubId } = req.params;

  Club.findById(clubId)
    .populate("courts")
    .then((foundClub) => {
      if (!foundClub) {
        return res.status(404).json({ message: "Club not found." });
      }
      res.status(200).json(foundClub.courts);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Courts by Id
function getCourtById(req, res, next) {
  const { courtId } = req.params;

  Court.findById(courtId)
    .then((foundCourt) => {
      if (!foundCourt) {
        return res.status(404).json({ message: "Court not found." });
      }
      res.status(200).json(foundCourt);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Club Comments
function getClubComments(req, res, next) {
  const { clubId } = req.params;

  Comment.find({ commentedClub: clubId })
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

  Club.find({
    $or: [
      { name: regExpQuery },
      { summary: regExpQuery },
      { address: regExpQuery },
    ],
  })
    .populate({ path: "manager", select: "firstName lastName" })
    .then((foundClubs) => {
      if (foundClubs) {
        res.status(200).json(foundClubs);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  editClub,
  deleteClub,
  joinClub,
  leaveClub,
  getClubCourts,
  getCourtById,
  getClubMembers,
  getClubComments,
  search,
};
