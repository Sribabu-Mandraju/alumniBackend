import mongoose from "mongoose";

const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    donationName: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    contributors: [
      {
        alumni: {
          type: Schema.Types.ObjectId,
          ref: "Alumni", // References the contributing alumni
          required: true,
        },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type: Boolean,
      default: true, // Default to active
    },
    totalFund: {
      type: Number,
      default: 0, // Default fund value
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Alumni", // References the Alumni who initiated the donation
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
