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

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middleware
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

// API routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// ------------------------
// Serve Admin first (important)
// ------------------------
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// ------------------------
// Serve frontend (catch-all for app routes)
// ------------------------
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// If you want to list specific frontend routes you can, but this catch-all works:
// Serve index.html for any other path (so React Router works)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
