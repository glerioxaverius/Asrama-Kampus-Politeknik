import { Request } from "express";
import express from "express";

export interface User {
  id: number;
  username?: string;
  email?: string;
}

declare module "express" {
  interface Request {
    user?: {
      id: number;
    };
  }
}
