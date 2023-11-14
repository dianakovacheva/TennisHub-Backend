const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { commentController, clubController } = require("../controllers");

router.get("/club/:clubId", clubController.getClubComments);
router.post("/club/:clubId/add-comment", auth(), commentController.addComment);
router.put("/:commentId/edit", auth(), commentController.editComment);
router.delete(
  "/club/:clubId/comment/:commentId/delete",
  auth(),
  commentController.deleteComment
);

module.exports = router;
