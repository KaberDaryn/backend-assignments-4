const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },

    status: {
      type: String,
      enum: ["registered", "cancelled", "attended"],
      default: "registered",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", participantSchema);
