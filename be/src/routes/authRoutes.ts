import express, { Request, Response, RequestHandler } from "express";
const router = express.Router();
import { register, login } from "../controllers/authController";

router.post(`/register`, register);
router.post(`/login`, login);
export default router;
