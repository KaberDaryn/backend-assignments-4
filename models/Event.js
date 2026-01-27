const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["volunteering", "fundraising", "awareness", "workshop", "other"],
      default: "other",
      required: true
    },

    capacity: { type: Number, min: 1, default: 1 },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
      required: true
    },

    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
