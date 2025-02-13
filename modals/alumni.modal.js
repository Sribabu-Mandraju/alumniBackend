import mongoose from "mongoose";

const { Schema } = mongoose;

const alumniSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    rguktId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contributions: {
      type: [String], // Array of contribution descriptions
      default: [],
    },
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation", // References donations made by alumni
      },
    ],
    isVerifiedAlumni: {
      type: Boolean,
      default: false, // Alumni verification status
    },
    currentPosition: {
      workingStatus: {
        type: String,
        enum: ["Employed", "Unemployed", "Student", "Self-Employed"],
        default: "Employed",
      },
      company: {
        type: String,
        trim: true,
        default: "Not Specified",
      },
    },
    profilePhoto: {
     type: String, // URL of profile photo
      default: "",
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", // References posts made by alumni
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Alumni = mongoose.model("Alumni", alumniSchema);

export default Alumni;
