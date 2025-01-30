import Job from '../modals/Jobs.js';
import cloudinary from "../config/cloudinary.js";


// Create Job
export const createJob = async (req, res) => {
    try {
        const { title, location, position, timing, type, description, technologies, pay, isVerified, postedBy, noNeedForSalary, link } = req.body;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const newJob = new Job({
            title, location, position, image: result.secure_url, timing, type, description,
            technologies, pay, isVerified, postedBy, noNeedForSalary, link
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy");
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Job by ID
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("postedBy");
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Job
export const updateJob = async (req, res) => {
    try {
        let updateData = req.body;

        // If a new image is uploaded, update Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = result.secure_url;
        }

        const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        res.status(200).json({ success: true, message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
