import express from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent); // Create an event
router.get("/", getEvents); // Get all events
router.put("/:id", updateEvent); // Update an event by ID
router.delete("/:id", deleteEvent); // Delete an event by ID

export default router;
