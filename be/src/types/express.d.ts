import { Request } from "express";
import express from "express";

export interface User {
  userId: number;
  username?: string;
  email?: string;
}

declare module "express" {
  interface Request {
    user?: {
      userId: number;
    };
  }
}
