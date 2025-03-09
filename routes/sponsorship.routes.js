import {createSponsorship,
    getAllSponsorships,
    getSponsorshipById,
    updateSponsorship,
    deleteSponsorship,
    verifySponsorship
} from "../controllers/sponsorship.controllers.js";
import express from "express";
const router =express.Router();
router.post("/create",createSponsorship);
router.get("/",getAllSponsorships);
router.get("/",getSponsorshipById);
router.put("/:id", updateSponsorship);
router.delete("/:id",deleteSponsorship);
router.patch("/:id/verify",verifySponsorship);

export default router;

