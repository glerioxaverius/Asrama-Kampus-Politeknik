import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dormRoutes from "./routes/dormRoutes";
import userRoutes from "./routes/userRoutes";
import apiRoutes from "./routes/userRoutes";

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,POST,DELETE", // Metode HTTP yang diizinkan
  credentials: true, // Mengizinkan cookie lintas origin (jika diperlukan)
};

const app = express();
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

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
