const { Schema, model, Types } = require("mongoose");

const IMAGE_URL_PATTERN =
  /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|bmp|svg)/;

const TennisClubSchema = new Schema(
  {
    tennisClubApiId: {
      type: String,
      trim: true,
    },
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
    location: {
      type: String,
      trim: true,
      required: true,
      minlength: [2, "The location must be at least 2 characters long."],
      maxlength: [100, "The location must be no longer than 100 characters."],
    },
    contact: {
      type: String,
      trim: true,
      required: true,
      minlength: [
        2,
        "The contact information must be at least 2 characters long.",
      ],
      maxlength: [
        100,
        "The contact information must be no longer than 100 characters.",
      ],
    },
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    commentsList: {
      type: [Types.ObjectId],
      ref: "Comment",
    },
    clubJoinedUsersList: [
      {
        type: [Types.ObjectId],
        ref: "User",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

const TennisClub = model("TennisClub", TennisClubSchema);

module.exports = TennisClub;
