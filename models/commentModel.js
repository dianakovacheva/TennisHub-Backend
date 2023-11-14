const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minlength: [2, "The comment must be at least 2 characters long."],
      maxlength: [500, "The comment must be no longer than 500 characters."],
    },
    commentAuthor: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    commentedClub: {
      type: Types.ObjectId,
      required: true,
      ref: "Club",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
