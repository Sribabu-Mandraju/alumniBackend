import express from "express";
import { createDonation, getDonations, updateDonation, deleteDonation } from "../controllers/donationController.js";

const router = express.Router();

// Define routes properly
router.post("/", createDonation); // Create a donation
router.get("/", getDonations); // Get all donations
router.put("/:id", updateDonation); // Update a donation by ID
router.delete("/:id", deleteDonation); // Delete a donation by ID

export default router;
