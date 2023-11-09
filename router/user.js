const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { auth } = require("../utils");

router.get("/profile", auth(), authController.getProfileInfo);
router.put("/profile", auth(), authController.editProfileInfo);
router.get("/clubs", auth(), authController.getUserTennisClubsList);
router.get("/comments", auth(), authController.getUserCommentsList);
router.get("/booked-courts", auth(), authController.getUserBookedCourtsList);

module.exports = router;
