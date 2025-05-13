import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dormRoutes from "./routes/dormRoutes";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.use(
  cors({
    origin: `http://localhost:3000`, // Izinkan permintaan hanya dari origin frontend Anda
    methods: "GET,HEAD,PUT,POST,DELETE", // Izinkan method HTTP yang diperlukan
    credentials: true, // Jika Anda menggunakan cookie atau otentikasi berbasis header
  })
);
app.use("/", authRoutes);
app.use("/", dormRoutes);

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
