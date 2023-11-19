const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { bookingController } = require("../controllers");

router.post("/bookCourt", auth(), bookingController.bookCourt);
router.get("/:bookingId", auth(), bookingController.getBookingById);
router.put("/:bookingId/edit", auth(), bookingController.editBooking);
router.delete("/:bookingId/delete", auth(), bookingController.deleteBooking);
router.get("/", bookingController.getAllBookings);

module.exports = router;
