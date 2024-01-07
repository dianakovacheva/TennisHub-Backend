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
    players: {
      type: [
        {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: (array) => array.length >= 2 && array.length <= 4,
        message: "The number of players must be between 2 and 4.",
      },
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Booking = model("Booking", bookingSchema);
module.exports = Booking;
