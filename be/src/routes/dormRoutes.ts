import express, { Request, Response, NextFunction } from "express";
import { getAllDorms, getDormById } from "../controllers/dormController";
import pool from "../config/db";

const router = express.Router();

router.get("/dorms", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM dorms");
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching dorms:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
