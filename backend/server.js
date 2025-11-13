import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// --------------------------
// FIXED CORS (VERY IMPORTANT)
// --------------------------
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// --------------------------
// API ROUTES
// --------------------------
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
