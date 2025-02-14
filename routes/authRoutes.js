// routes/authRoutes.js
import express from "express";

import { signUp, login, requestAlumniVerification, verifyAlumni } from '../controllers/authController.js';
import { adminTokenCheck } from '../middlewares/admin.middleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Signup route
router.post("/signup", signUp);

// Login route
router.post("/login", login);


// Alumni verification routes
router.post('/alumni/request-verification',authMiddleware, requestAlumniVerification);
router.patch('/alumni/verify/:id', adminTokenCheck, verifyAlumni);


export default router;
