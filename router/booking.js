const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { bookingController } = require("../controllers");

router.post("/bookCourt", auth(), bookingController.bookCourt);
router.delete("/:bookingId/delete", auth(), bookingController.deleteBooking);

module.exports = router;
