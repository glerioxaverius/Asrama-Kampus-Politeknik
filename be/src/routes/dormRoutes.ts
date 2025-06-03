import express from "express";
import {
  getAllDorms,
  getDormById,
  applyForDorm,
} from "../controllers/dormController";

const router = express.Router();

router.get("/", getAllDorms);
router.get("/:id", getDormById);
router.post("/:id/apply", applyForDorm);

export default router;
