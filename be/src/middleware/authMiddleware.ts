import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const secretKey = process.env.JWT_SECRET || "adminDorm123";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: number };
    const result = await pool.query("SELECT id FROM users WHERE id = $1", [
      decoded.userId,
    ]);
    if (result.rows.length === 0) {
      res.sendStatus(401);
      return;
    }
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.sendStatus(403);
    return;
  }
};
