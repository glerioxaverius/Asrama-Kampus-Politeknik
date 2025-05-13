import express, { Request, Response, RequestHandler } from "express";
const router = express.Router();
import { register, login } from "../controllers/authController";

const registerHandler: RequestHandler = async (req, res) => {
  await register(req, res);
};

const loginHandler: RequestHandler = async (req, res) => {
  await login(req, res);
};

router.post(`/register`, registerHandler);
router.post(`/login`, loginHandler);
export default router;
