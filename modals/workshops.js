import mongoose from "mongoose";

const { Schema } = mongoose;

const workshopSchema = new Schema(
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
    organisedBy: {
      type: String,
      required: true,
      trim: true,
    },
    isVerifiedWorkshop: {
      type: Boolean,
      default: false, // Default to unverified
    },
    time: {
      type: Date,
      required: true, // Ensures a valid date is provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;
