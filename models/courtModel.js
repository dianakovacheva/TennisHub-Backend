const { Schema, model, Types } = require("mongoose");

const courtSchema = new Schema({
  clubId: {
    type: Types.ObjectId,
    required: true,
    ref: "Club",
  },
  courtName: {
    type: String,
    required: true,
  },
  surface: {
    type: String,
    required: true,
    enum: ["Clay", "Concrete", "Hard", "Grass", "Other"],
  },
  indoor: {
    type: Boolean,
    required: true,
  },
  lighting: {
    type: Boolean,
    required: true,
  },
});

const Court = model("Court", courtSchema);

module.exports = Court;
