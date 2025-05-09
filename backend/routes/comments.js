import express from "express";
import { getComments, addComment } from "../controllers/comment.js";
const router = express.Router();

router.get("/getComments", getComments);
router.post("/addComment", addComment);
export default router;
