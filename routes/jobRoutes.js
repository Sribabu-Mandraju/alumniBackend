import express from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/jobController.js";
import multer from "multer";


const router = express.Router();

// Multer Configuration for File Upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// CRUD Routes
router.post("/", upload.single("image"), createJob);  // Create Job
router.get("/", getJobs);  // Get all Jobs
router.get("/:id", getJobById);  // Get Job by ID
router.put("/:id", upload.single("image"), updateJob);  // Update Job
router.delete("/:id", deleteJob);  // Delete Job

export default router;

