const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { userController, bookingController } = require("../controllers");

router.get("/:userId", auth(), userController.getUserById);
router.put("/:userId", auth(), userController.editUserInfo);
router.get("/:userId/clubs", auth(), userController.getUserCreatedClubs);
router.get("/:userId/bookings", auth(), bookingController.getUserBookings);

module.exports = router;
