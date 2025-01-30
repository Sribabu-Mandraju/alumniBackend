import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: Date,
      required: true, // Ensures a valid date is provided
    },
    organisedBy: {
      type: String,
      required: true,
      trim: true,
    },
    isVerifiedEvent: {
      type: Boolean,
      default: false, // Default to unverified
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
