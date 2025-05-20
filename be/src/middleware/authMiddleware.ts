import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
  console.log("req.cookies object:", req.cookies);

  if (req.cookies && typeof req.cookies.authToken === "string") {
    token = req.cookies.authToken;
    console.log("Token extracted from Cookie:", token);
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const headerToken = authHeader.split(" ")[1];
    // Hanya gunakan token dari header jika itu bukan 'undefined' string literal
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

    const user = await new Promise((resolve, reject) => {
      jwt.verify(token as string, jwtSecret, (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
          return reject(err);
        }
        resolve(decoded);
      });
    });

    // Pasang payload token ke req.user
    (req as any).user = user as {
      userId: number;
      email: string;
    };
    console.log("req.user set to:", (req as any).user);
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
