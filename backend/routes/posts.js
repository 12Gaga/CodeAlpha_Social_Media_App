import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";
const router = express.Router();

router.get("/getPost", getPosts);
router.post("/addPost", addPost);
router.delete("/deletePost", deletePost);
export default router;
