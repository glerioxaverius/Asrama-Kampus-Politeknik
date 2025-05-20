import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dormRoutes from "./routes/dormRoutes";
import userRoutes from "./routes/userRoutes";
import apiRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,POST,DELETE", // Metode HTTP yang diizinkan
  credentials: true, // Mengizinkan cookie lintas origin (jika diperlukan)
};

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors(corsOptions)); // Gunakan middleware cors dengan opsi

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.use("/", authRoutes);
app.use("/", dormRoutes);
app.use("/", userRoutes);
app.use;

app.listen(port, () => console.log(`Server running on port ${port}`));
