// src/routes/userRoutes.ts
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getDetailById,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";

const router = express.Router();

// Semua handler harus dibungkus asyncHandler jika mereka async atau memanggil async fungsi
router.get(
  "/me",
  asyncHandler(authenticateToken),
  asyncHandler(getUserProfile)
); // <-- Bungkus authenticateToken
router.put(
  "/:id",
  asyncHandler(authenticateToken),
  asyncHandler(updateUserProfile)
); // <-- Bungkus authenticateToken
router.get("/details/:id", asyncHandler(getDetailById)); // getDetailById juga async

export default router;
