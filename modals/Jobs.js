
import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    timing: { type: String, enum: ["Full-time", "Internship"], required: true },
    type: { type: Boolean, default: false }, // true = Permanent, false = Not Permanent
    description: { type: String, required: true },
    technologies: { type: [String], required: true },
    pay: { type: String, required: false }, // Optional field
    isVerified: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
    noNeedForSalary: { type: Boolean, default: false },
    link: { type: [String], required: true }
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
