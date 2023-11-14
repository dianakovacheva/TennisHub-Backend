const { Schema, model, Types } = require("mongoose");

const bookingSchema = new Schema(
  {
    courtId: {
      type: Types.ObjectId,
      required: true,
      ref: "Court",
    },
    bookedBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    players: [
      {
        type: [Types.ObjectId],
        ref: "User",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

const Booking = model("Booking", bookingSchema);
module.exports = Booking;
