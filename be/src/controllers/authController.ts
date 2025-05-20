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
    console.log("Result from database:", result.rows); // Log hasil query database
    const user = result.rows[0];

    if (user) {
      console.log("User found:", user); // Log user yang ditemukan
      console.log("Comparing password:", password, user.password); // Log password yang dibandingkan
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("isValid: ", isPasswordValid);
      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });
        console.log("Token generated:", token); // Log token yang dihasilkan
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000, // Contoh 1 jam
        });
        res.status(200).json({
          message: "Login Successful",
          user: { id: user.id, username: user.username, email: user.email },
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};
