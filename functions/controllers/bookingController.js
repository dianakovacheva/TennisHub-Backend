const { User, Booking, Club } = require("../models");

// Book court
async function bookCourt(req, res) {
  try {
    const { courtId, bookedBy, startTime, endTime, players } = req.body;
    const { _id: userId } = req.user;

    // Check if the court is available for the specified time slot
    const isCourtAvailable = await isCourtAvailableForBooking(
      courtId,
      startTime,
      endTime
    );

    if (!isCourtAvailable) {
      return res
        .status(400)
        .json({ error: "Court is not available for the specified time slot." });
    }

    // Create a new booking
    const booking = new Booking({
      courtId,
      bookedBy,
      startTime,
      endTime,
      players,
    });

    // Save the booking to the database
    await booking.save();

    res.json({ message: "Court booked successfully." });

    await User.updateOne(
      { _id: userId },
      { $addToSet: { userBookings: booking._id } },
      { new: true }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Function to check if the court is available for booking
async function isCourtAvailableForBooking(courtId, startTime, endTime) {
  const conflictingBookings = await Booking.find({
    courtId: courtId,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check if the new booking overlaps with existing bookings
      { startTime: { $gte: startTime, $lt: endTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
    ],
  });

  return conflictingBookings.length === 0;
}

// Get all bookings
function getAllBookings(req, res, next) {
  Booking.find()
    .populate({
      path: "players",
      select: "firstName lastName fullName",
    })

    .then((foundBookings) => {
      if (foundBookings) {
        res.status(200).json(foundBookings);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get booking by id
function getBookingById(req, res, next) {
  const { bookingId } = req.params;

  Booking.findById(bookingId)
    .then((foundBooking) => {
      if (foundBooking) {
        res.status(200).json(foundBooking);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// User Bookings
function getUserBookings(req, res, next) {
  const { _id: userId } = req.user;

  Booking.find({ players: { $in: userId } })
    .then((foundBookings) => {
      res.status(200).json(foundBookings);
    })
    .catch((err) => res.send(err));

  // User.findById({ _id: userId }, { password: 0, __v: 0 })
  //   .populate("userBookedCourts")
  //   .then((foundUser) => {
  //     res.status(200).json(foundUser.userBookedCourts);
  //   })
  //   .catch((err) => res.send(err));
}

// Edit Booking
function editBooking(req, res) {
  const { bookingId } = req.params;
  const { _id: userId } = req.user;
  const { courtId, startTime, endTime, players } = req.body;

  Booking.findOneAndUpdate(
    { _id: bookingId, players: { $in: userId } },
    {
      courtId: courtId,
      startTime: startTime,
      endTime: endTime,
      players: players,
    }
  )
    .then((updatedBooking) => {
      if (updatedBooking) {
        res.status(200).json(updatedBooking);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Delete Booking
function deleteBooking(req, res) {
  const { bookingId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Booking.findOneAndDelete({ _id: bookingId, players: { $in: userId } }),
    User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          userBookings: bookingId,
        },
      },
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

module.exports = {
  bookCourt,
  getAllBookings,
  getBookingById,
  editBooking,
  deleteBooking,
  getUserBookings,
};
