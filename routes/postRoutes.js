import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost); // Create a post
router.get("/", getPosts); // Get all posts
router.put("/:id", updatePost); // Update a post by ID
router.delete("/:id", deletePost); // Delete a post by ID

export default router;
