// src/backend/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// --- START: Deklarasi Global untuk Type `Request` ---

dotenv.config();
// PENTING: Jika file src/backend/types/express.d.ts Anda tidak berfungsi
// dengan baik, letakkan blok ini di sini sebagai solusi sementara.
// Idealnya, ini harus berada di file .d.ts terpisah yang di-include oleh tsconfig.
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        // Tambahkan properti lain dari payload JWT Anda di sini
        // contoh: username?: string; role?: string;
      };
    }
  }
}
// --- END: Deklarasi Global ---

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  let token: string | null = null;

  // Debugging logs:
  console.log("--- authenticateToken start ---");
  console.log("Request path:", req.path);
  console.log("Auth Header from Request:", authHeader);
  console.log("RAW req.headers.cookie:", req.headers.cookie); // Cek header 'Cookie' mentah dari permintaan
  console.log("PARSED req.cookies object:", req.cookies); // Cek objek req.cookies setelah cookie-parser
  console.log(
    "Value of req.cookies.authToken:",
    req.cookies ? req.cookies.authToken : "N/A - req.cookies null/undefined"
  );
  // Pastikan Anda telah menginstal 'cookie-parser' dan menggunakannya di app.ts
  // jika Anda mengakses req.cookies
  // console.log("req.cookies object:", req.cookies);

  if (req.cookies && typeof req.cookies.authToken === "string") {
    token = req.cookies.authToken;
    console.log("Token extracted from Cookie:", token);
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const headerToken = authHeader.split(" ")[1];
    if (headerToken !== "undefined") {
      token = headerToken;
      console.log("Token extracted from Header (overriding cookie):", token);
    } else {
      console.log(
        "Header token is 'undefined' string, sticking with cookie (if found)."
      );
    }
  }

  if (typeof token === "string") {
    token = token.trim();
  }

  if (token == null || token === "") {
    console.warn(
      "Authentication failed: No token found in header or cookie after all checks."
    );
    console.log("--- authenticateToken end (401) ---");
    return res
      .status(401)
      .json({ message: "Akses ditolak: Token tidak ditemukan." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in environment variables!");
    console.log("--- authenticateToken end (500) ---");
    return res
      .status(500)
      .json({ message: "Konfigurasi server tidak lengkap." });
  }

  try {
    console.log("Token FINAL being passed to jwt.verify:", token);

    interface JwtPayload {
      userId: number;
      email: string;
      iat: number;
      exp: number;
      // ... properti lain dari JWT payload Anda
    }

    const decodedUser = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token as string, jwtSecret, (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
          return reject(err);
        }
        if (typeof decoded === "string") {
          return reject(new Error("Decoded token is a string, not an object."));
        }
        resolve(decoded as JwtPayload);
      });
    });

    // TypeScript sekarang seharusnya tidak mengeluh tentang 'req.user'
    req.user = decodedUser;
    console.log("req.user set to:", req.user);
    console.log("--- authenticateToken end (next()) ---");
    next();
  } catch (err: any) {
    console.error("Token verification failed (catch block):", err.message);
    if (err.name === "TokenExpiredError") {
      console.log("--- authenticateToken end (401 - expired) ---");
      return res
        .status(401)
        .json({ message: "Token telah kadaluarsa. Silakan login ulang." });
    }
    console.log("--- authenticateToken end (403 - invalid/malformed) ---");
    return res
      .status(403)
      .json({ message: "Akses ditolak: Token tidak valid." });
  }
};
