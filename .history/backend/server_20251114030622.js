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
// CONNECT DATABASE & CLOUDINARY
// ------------------------
connectDB();
connectCloudinary();

// ------------------------
// MIDDLEWARE
// ------------------------
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ------------------------
// API ROUTES
// ------------------------
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// ------------------------
// ADMIN PANEL
// ------------------------
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// ------------------------
// FRONTEND
// ------------------------
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ------------------------
// START SERVER
// ------------------------
app.listen(port, () =>
  console.log(`🚀 Backend + Frontend + Admin running on http://localhost:${port}`)
);
