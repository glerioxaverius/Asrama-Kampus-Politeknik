import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";
    const values = [username, email, hashedPassword];
    console.log("Executing SQL:", query, values); // Tambahkan log ini
    const result = await pool.query(query, values);
    const user = result.rows[0];
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, "adminDorm123", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
