import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
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
  image: {
    type: String, // URL of the image
    required: false,
    trim: true,
  },
  links: {
    type: [String], // Array of links (URLs)
    required: false,
    validate: {
      validator: (links) => links.every((link) => /^https?:\/\/.+$/.test(link)),
      message: "All links must be valid URLs.",
    },
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
