import express from "express";
import {
  getRelationship,
  addRelationship,
  deleteRelationship,
} from "../controllers/follow.js";
const router = express.Router();

router.get("/getRelationship", getRelationship);
router.post("/addRelationship", addRelationship);
router.delete("/deleteRelationship", deleteRelationship);
export default router;
