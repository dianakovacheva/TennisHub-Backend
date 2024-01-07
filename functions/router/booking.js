const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { bookingController } = require("../controllers");

router.post("/book-court", auth(), bookingController.bookCourt);
router.get("/:bookingId", bookingController.getBookingById);
router.put("/:bookingId/edit", auth(), bookingController.editBooking);
router.delete("/:bookingId/delete", auth(), bookingController.deleteBooking);
router.get("/", bookingController.getAllBookings);

module.exports = router;
