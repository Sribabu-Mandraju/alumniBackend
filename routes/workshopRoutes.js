import express from "express";
import { createWorkshop, getWorkshops, updateWorkshop, deleteWorkshop } from "../controllers/workshopController.js";

const router = express.Router();

router.post("/", createWorkshop); // Create a workshop
router.get("/", getWorkshops); // Get all workshops
router.put("/:id", updateWorkshop); // Update a workshop by ID
router.delete("/:id", deleteWorkshop); // Delete a workshop by ID

export default router;
