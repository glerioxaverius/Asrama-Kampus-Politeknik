import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

export const getAllDorms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query("SELECT * FROM dorms");
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching all dorms from DB:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error saat mengambil semua asrama." });
  }
};

export const getDormById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Dapatkan ID dari parameter URL

  if (!id) {
    // Validasi sederhana
    return res.status(400).json({ message: "ID asrama diperlukan." });
  }

  try {
    const result = await pool.query("SELECT * FROM dorms WHERE id = $1", [id]); // Sesuaikan nama kolom ID di DB Anda

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asrama tidak ditemukan." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error fetching dorm with ID ${id} from DB:`, error);
    res
      .status(500)
      .json({ message: "Internal Server Error saat mengambil detail asrama." });
  }
};
