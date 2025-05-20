import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const secretKey = process.env.JWT_SECRET || "adminDorm123";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.authToken; // Mengambil token dari cookie

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: number };
    const result = await pool.query("SELECT id FROM users WHERE id = $1", [
      decoded.userId,
    ]);
    if (result.rows.length === 0) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
