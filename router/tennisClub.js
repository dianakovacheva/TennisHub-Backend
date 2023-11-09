const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { tennisClubController, commentController } = require("../controllers");

// Tennis Club Related Routes
router.post("/create-club", auth(), tennisClubController.createTennisClub);
router.put(
  "/details/:clubId/edit",
  auth(),
  tennisClubController.editTennisClub
);
router.put(
  "/details/:clubId/join",
  auth(),
  tennisClubController.joinTennisClub
);
router.delete(
  "/details/:clubId/remove-joined",
  auth(),
  tennisClubController.removeJoinedTennisClub
);
router.delete(
  "/details/:clubId/delete",
  auth(),
  tennisClubController.deleteTennisClub
);

// Comment Related Routes
router.get(
  "/details/:clubId/comments",
  tennisClubController.getTennisClubComments
);
router.post(
  "/details/:clubId/comment",
  auth(),
  commentController.commentTennisClub
);
router.put(
  "/details/:clubId/comments/:commentId",
  auth(),
  commentController.editComment
);
router.delete(
  "/details/:clubId/comments/:commentId",
  auth(),
  commentController.deleteTennisClubComment
);

// Search route
router.get("/search", tennisClubController.search);

router.get("/details/:clubId", tennisClubController.getTennisClubById);
router.get("/", tennisClubController.getAllTennisClubs);

module.exports = router;
