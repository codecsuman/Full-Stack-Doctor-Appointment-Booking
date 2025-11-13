import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __dirname = path.resolve();

// ------------------------
//  CONNECT SERVICES
// ------------------------
connectDB();
connectCloudinary();

// ------------------------
//  MIDDLEWARE
// ------------------------
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// ------------------------
//  API ROUTES
// ------------------------
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// =============================================================
//  SERVE FRONTEND (USER SITE)
// =============================================================
app.use("/", express.static(path.join(__dirname, "frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Catch all NON-ADMIN paths → Frontend must handle them
app.get([
  "/login",
  "/signup",
  "/doctors",
  "/appointments",
  "/profile",
  "/contact"
], (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// =============================================================
//  SERVE ADMIN PANEL
// =============================================================
app.use("/admin", express.static(path.join(__dirname, "admin/dist")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dist", "index.html"));
});

// ------------------------
//  START SERVER
// ------------------------
app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
