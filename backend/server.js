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

// Get absolute dir path for backend folder
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
    origin: "*", // no CORS need, because front+admin served by backend
    credentials: true,
  })
);

// ------------------------
// API ROUTES
// ------------------------
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// =============================================================
//  SERVE ADMIN PANEL (from ../admin/dist)
// =============================================================
const adminPath = path.join(__dirname, "../admin/dist");
app.use("/admin", express.static(adminPath));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// =============================================================
//  SERVE FRONTEND REACT APP (from ../frontend/dist)
// =============================================================
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ------------------------
// START SERVER
// ------------------------
app.listen(port, () =>
  console.log(`🚀 Backend + Frontend + Admin running at http://localhost:${port}`)
);
