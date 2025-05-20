import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID tidak ditemukan dalam token." });
    }

    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data (/me):", error);
    res
      .status(500)
      .json({ message: "Internal Server Error saat mengambil data pengguna." });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const userIdFromToken = (req as any).user.userId;

  if (parseInt(id) !== userIdFromToken) {
    return res.status(403).json({
      message: "Forbidden: Anda tidak diizinkan mengubah profil pengguna lain.",
    });
  }

  try {
    let query = "UPDATE users SET";
    const queryParams = [];
    let paramIndex = 1;

    if (username) {
      query += ` username = $${paramIndex},`;
      queryParams.push(username);
      paramIndex++;
    }
    if (email) {
      query += ` email = $${paramIndex},`;
      queryParams.push(email);
      paramIndex++;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ` password = $${paramIndex},`;
      queryParams.push(hashedPassword);
      paramIndex++;
    }

    if (queryParams.length === 0) {
      return res
        .status(400)
        .json({ message: "Tidak ada data yang disediakan untuk update." });
    }

    query = query.slice(0, -1);

    query += ` WHERE id = $${paramIndex} RETURNING id, username, email`;
    queryParams.push(id);

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui.", user: result.rows[0] });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error saat memperbarui profil." });
  }
};

export const getDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user detail by ID:", error);
    res
      .status(500)
      .json({
        message: "Internal Server Error saat mengambil detail pengguna.",
      });
  }
};
