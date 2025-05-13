import { Request, Response } from "express";
import pool from "../config/db";

export const getAllDorms = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM dorms");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM dorms WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Dorm not found" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
