import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  verifyEvent,
  getUpcomingEvents,
  getPastEvents
} from "../controllers/eventController.js";


const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);
router.put("/:id", updateEvent);
router.put("/:id/verify", verifyEvent);
router.delete("/:id", deleteEvent);

export default router;
