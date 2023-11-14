const { Schema, model, Types } = require("mongoose");

const IMAGE_URL_PATTERN =
  /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|bmp|svg)/;

const clubSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      minlength: [2, "The name must be at least 2 characters long."],
      maxlength: [100, "The name must be no longer than 100 characters."],
    },
    imageURL: {
      type: String,
      validate: {
        validator: (value) => IMAGE_URL_PATTERN.test(value),
        message: "Invalid URL.",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
      minlength: [5, "The summary must be at least 5 characters long."],
      maxlength: [1000, "The summary must be no longer than 1000 characters."],
    },
    address: {
      type: String,
      trim: true,
      required: true,
      minlength: [2, "The address must be at least 2 characters long."],
      maxlength: [100, "The address must be no longer than 100 characters."],
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "The phone number must be at least 3 characters long."],
      maxlength: [20, "The phone number must be no longer than 20 characters."],
    },
    manager: [
      {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    courts: [
      {
        type: [Types.ObjectId],
        ref: "Court",
      },
    ],
    members: [
      {
        type: [Types.ObjectId],
        ref: "User",
      },
    ],
    clubComments: [
      {
        type: [Types.ObjectId],
        ref: "Comment",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

const Club = model("Club", clubSchema);

module.exports = Club;
