import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    alumni_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni", // References the Alumni model
      required: true,
    },
    isVerifiedPost: {
      type: Boolean,
      default: false, // Default to unverified
    },
    image: {
      type: String, // Stores image URL
      default: null, // Allows posts without images
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
