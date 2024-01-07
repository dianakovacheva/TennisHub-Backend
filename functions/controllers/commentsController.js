const { Club, Comment } = require("../models");

// Add Comment
function addComment(req, res, next) {
  const { clubId } = req.params;
  const { _id: userId } = req.user;
  const { comment } = req.body;

  Comment.create({
    comment: comment,
    commentAuthor: [userId],
    commentedClub: clubId,
  })
    .then((createdComment) => {
      if (createdComment) {
        return Promise.all([
          Club.findOneAndUpdate(
            { _id: clubId },
            { $push: { comments: createdComment._id } },
            { new: true }
          ),
          Comment.findOne({ _id: createdComment._id })
            .populate("commentAuthor")
            .populate("commentedClub"),
        ]).then((result) => {
          res.status(200).json(result[1].comment);
        });
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get all comments
function getAllComments(req, res, next) {
  Comment.find()
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

// Edit Comment
function editComment(req, res, next) {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { _id: userId } = req.user;

  Comment.findOneAndUpdate(
    { _id: commentId },
    { comment },
    {
      new: true,
    }
  )
    .then((updatedComment) => {
      if (updatedComment) {
        res.status(200).json(updatedComment);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch(next);
}

// Delete Comment
function deleteComment(req, res, next) {
  const { commentId, clubId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Comment.findOneAndDelete({ _id: commentId }),
    Club.findOneAndUpdate(
      { _id: clubId },
      { $pull: { comments: commentId } },
      { new: true }
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

// User Comments
function getUserComments(req, res, next) {
  const { _id: userId } = req.user;

  // Validate either clubId or userId is provided
  // if (!clubId && !userId) {
  //   return res
  //     .status(400)
  //     .json({ message: "Either Club ID or User ID is required." });
  // }

  // let query = {};

  // if (clubId) {
  //   query.commentedClub = clubId;
  // }

  // if (userId) {
  //   query.commentAuthor = userId;
  // }

  Comment.findOne({ commentAuthor: { $in: userId } })
    .then((foundUserComments) => {
      if (!foundUserComments) {
        res.status(401).json({ message: `No comments yet!` });
      }
      res.status(200).json(foundUserComments);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

module.exports = {
  addComment,
  getAllComments,
  editComment,
  deleteComment,
  getUserComments,
};
