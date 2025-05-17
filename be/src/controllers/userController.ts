import { Request, Response } from "express";
import pool from "../config/db";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Perhatikan tipe kembalian Promise<void>
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProfile = result.rows[0];
    res.status(200).json(userProfile);
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = parseInt(req.params.id); // Ambil ID dari parameter rute
    const { username, email /* tambahkan field lain yang bisa diupdate */ } =
      req.body;

    // Validasi bahwa ID dari token sesuai dengan ID yang ingin diupdate (opsional, tergantung kebutuhan otorisasi)
    if (req.user.id !== userId) {
      res.status(403).json({
        message: "Forbidden: You can only update your own profile.",
      });
      return;
    }

    // Lakukan query UPDATE ke database
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email",
      [username, email, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = result.rows[0];
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDetailById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM details WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Detail not found" });
    }
  } catch (error: any) {
    console.error("Error fetching detail:", error);
    res.status(500).json({ error: error.message });
  }
};
