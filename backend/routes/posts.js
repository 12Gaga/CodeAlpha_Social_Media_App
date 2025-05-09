import express from "express";
import { getPosts, addPost } from "../controllers/post.js";
const router = express.Router();

router.get("/getPost", getPosts);
router.post("/addPost", addPost);
export default router;
