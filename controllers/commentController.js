const { User, TennisClub, Comment } = require("../models");

// Comment TennisClub
function commentTennisClub(req, res, next) {
  const { TennisClubId } = req.params;
  const { _id: userId } = req.user;
  const { comment } = req.body;

  Comment.create({
    comment: comment,
    commentAuthor: [userId],
    commentedTennisClub: TennisClubId,
  })
    .then((createdComment) => {
      if (createdComment) {
        return Promise.all([
          TennisClub.findOneAndUpdate(
            { _id: TennisClubId },
            { $push: { commentsList: createdComment._id } },
            { new: true }
          ),
          User.findOneAndUpdate(
            { _id: userId },
            { $push: { userCommentsList: createdComment._id } },
            { new: true }
          ),
          Comment.findOne({ _id: createdComment._id })
            .populate("commentAuthor")
            .populate("commentedTennisClub"),
        ]).then((result) => {
          res.status(200).json(result[2]);
        });
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// function editComment(req, res, next) {
//   const { commentId } = req.params;
//   const { commentText } = req.body;
//   const { _id: userId } = req.user;

//   // if the userId is not the same as this one of the post, the post will not be updated
//   Comment.findOneAndUpdate(
//     { _id: commentId, userId },
//     { text: commentText },
//     { new: true }
//   )
//     .then((updatedComment) => {
//       if (updatedComment) {
//         res.status(200).json(updatedComment);
//       } else {
//         res.status(401).json({ message: `Not allowed!` });
//       }
//     })
//     .catch(next);
// }

// Delete Tennis Club Comment
function deleteTennisClubComment(req, res, next) {
  const { commentId, TennisClubId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Comment.findOneAndDelete({ _id: commentId, commentAuthor: userId }),
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { userCommentsList: commentId } }
    ),
    TennisClub.findOneAndUpdate(
      { _id: TennisClubId },
      { $pull: { commentsList: commentId } }
    ),
  ])
    .then(([deletedOne, _, __]) => {
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

module.exports = {
  commentTennisClub,
  deleteTennisClubComment,
};
