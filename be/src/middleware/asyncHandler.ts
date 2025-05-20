// src/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

// Tipe untuk Express Request Handler asynchronous
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // Bisa mengembalikan Promise<void> atau Promise<Response>

// Fungsi wrapper untuk menangani Promise yang dikembalikan oleh async functions
const asyncHandler =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
