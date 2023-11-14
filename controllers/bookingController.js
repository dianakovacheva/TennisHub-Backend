const { User, Booking } = require("../models");

let courtId;

async function bookCourt(req, res) {
  try {
    const { courtId, bookedBy, startTime, endTime, players } = req.body;

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
      { _id: bookedBy },
      { $addToSet: { userBookedCourts: courtId } },
      { new: true }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to check if the court is available for booking
async function isCourtAvailableForBooking(courtId, startTime, endTime) {
  // Implement your logic to check if the court is available for the specified time slot
  // For example, query the database to see if there are any conflicting bookings

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
// Delete Booking
function deleteBooking(req, res) {
  const { bookingId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Booking.findOneAndDelete({ _id: bookingId }),
    User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          userBookedCourts: courtId,
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

// User Bookings
// function getuserBookedCourts(req, res, next) {
//   const { _id: userId } = req.user;

//   User.findById({ _id: userId }, { password: 0, __v: 0 })
//     .populate("userBookedCourts")
//     .then((foundUser) => {
//       res.status(200).json(foundUser.userBookedCourts);
//     })
//     .catch((err) => res.send(err));
// }

module.exports = {
  bookCourt,
  deleteBooking,
  // getuserBookedCourts,
};
