import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import asyncHandler from "../middleware/asyncHandler";

export const getAllDorms = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM dorms ORDER BY name ASC");
  res.status(200).json(result.rows);
});

export const getDormById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Backend received request for dorm ID: ${id}`);
  if (!id) {
    res.status(400).json({ message: "ID asrama diperlukan." });
    return;
  }

  const result = await pool.query("SELECT * FROM dorms WHERE id = $1", [id]);
  console.log(`Query result for ID ${id}: ${result.rows.length} rows found.`);
  if (result.rows.length === 0) {
    res.status(404).json({ message: "Asrama tidak ditemukan." });
    return;
  }

  res.status(200).json(result.rows[0]);
});

export const applyForDorm = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: dormId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        message:
          "Pengguna tidak terautentikasi atau ID pengguna tidak ditemukan.",
      });
      return;
    }

    const existingApplication = await pool.query(
      "SELECT * FROM user_applications WHERE user_id = $1",
      [userId]
    );

    if (existingApplication.rows.length > 0) {
      res
        .status(400)
        .json({ message: "Anda sudah memiliki pengajuan dorm yang aktif." });
      return;
    }

    const dormResult = await pool.query(
      "SELECT * FROM dorms WHERE id = $1 AND available = TRUE",
      [dormId]
    );

    if (dormResult.rows.length === 0) {
      res
        .status(400)
        .json({ message: "Dorm tidak tersedia atau tidak ditemukan." });
      return;
    }

    await pool.query(
      "INSERT INTO user_applications (user_id, dorm_id, status, application_date) VALUES ($1, $2, $3, NOW())",
      [userId, dormId, "pending"]
    );

    res.status(200).json({
      message: "Pengajuan dorm berhasil diajukan. Menunggu persetujuan.",
      dormId,
      userId,
      status: "pending",
    });
  }
);
