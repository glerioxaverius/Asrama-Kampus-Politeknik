import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dormRoutes from "./routes/dormRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
  credentials: true,
};

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/dorms", dormRoutes);
app.use("/api/users", userRoutes);
app.use("/api/", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
