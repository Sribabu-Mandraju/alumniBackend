import express from "express";
import {
  getAlumniProfile,
  updateAlumniProfile,
  updateProfilePhoto,
  verifyAlumni,
  addContribution,
  removeContribution,
  updateCurrentPosition,
  addPost,
  deleteAlumni
} from "../controllers/authController.js";
import { signUp } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
const router = express.Router();

router.get("/:id", getAlumniProfile);

router.put("/:id", updateAlumniProfile);
router.put("/:id/photo", updateProfilePhoto);
router.put("/:id/verify", verifyAlumni);
router.put("/:id/contributions/add", addContribution);
router.put("/:id/contributions/remove", removeContribution);
router.put("/:id/position", updateCurrentPosition);
router.put("/:id/posts", addPost);

router.delete("/:id", deleteAlumni);

router.post("/signup", signUp);
router.post("/login", login);

export default router;
