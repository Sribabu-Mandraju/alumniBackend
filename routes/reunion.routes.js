import express from "express";
import {createReunion,
    getAllReunions,
    getReunionById,
    updateReunion,
    deleteReunion,
    rsvpReunion
} from "../controllers/reunion-controllers.js";
const router=express.Router();
router.post("/create",createReunion);
router.get("/",getAllReunions);
router.get("/:id", getReunionById);
router.put("/:id",updateReunion);
router.delete("/:id",deleteReunion);
router.post("/:id/rsvp",rsvpReunion);
export default router;
