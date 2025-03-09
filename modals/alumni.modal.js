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
    workshops: {
      type: [String], // Array of workshops attended or conducted
      default: [],
    },
    events: {
      type: [String], // Array of event participation
      default: [],
    },
    postedJobs: {
      type: [String], // Array of job posts shared by alumni
      default: [],
    },
    certificates: {
      type: [String], // Array of certificate URLs or titles
      default: [],
    },
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    isVerifiedAlumni: {
      type: Boolean,
      default: false,
    },
    isRequestedToVerifyAlumni: {
      type: Boolean,
      default: false,
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
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Alumni = mongoose.model("Alumni", alumniSchema);

export default Alumni;
