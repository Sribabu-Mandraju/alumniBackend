import express from "express";
import {submitContactForm,getAllContacts,deleteContactMessage} from "../controllers/contact.controllers.js";
const router=express.Router();
router.post("/",submitContactForm);
router.get("/",getAllContacts);
router.delete("/:id",deleteContactMessage);
export default router;