import express, { Request, Response, RequestHandler } from "express";
const router = express.Router();
import { register, login, logoutUser } from "../controllers/authController";

router.post(`/register`, register);
router.post(`/login`, login);
router.post("/logout", logoutUser);
export default router;
