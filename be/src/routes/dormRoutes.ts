import express, { Request, Response, NextFunction } from "express";
import { getAllDorms, getDormById } from "../controllers/dormController";
// import pool from "../config/db"; // Hapus import pool di sini jika sudah di controller

const router = express.Router();

// 1. Rute untuk mendapatkan SEMUA asrama (GET /dorms) - Ini lebih spesifik
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllDorms(req, res, next);
  } catch (error) {
    console.error("Error in dormRoutes for getAllDorms:", error);
    res.status(500).json({ message: "Gagal mendapatkan daftar asrama." });
  }
});

// 2. Rute untuk mendapatkan DETAIL asrama berdasarkan ID (GET /dorms/:id) - Ini lebih umum
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getDormById(req, res, next);
  } catch (error) {
    // Pesan error dari sini sekarang akan lebih jelas
    console.error(
      `Error in dormRoutes for getDormById with ID ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Internal Server Error saat mengambil detail asrama." });
  }
});

export default router;
