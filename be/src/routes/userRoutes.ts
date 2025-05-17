import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getDetailById,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authenticateToken, getUserProfile);
router.put("/users/:id", authenticateToken, updateUserProfile);
router.get("/details/:id", getDetailById);

export default router;
