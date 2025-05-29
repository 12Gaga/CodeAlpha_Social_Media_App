import express from "express";
import { getUser, updateUser, findUser } from "../controllers/user.js";
const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/findUser", findUser);
router.put("/updateUser", updateUser);
export default router;
