import express from "express";
import router from "./routes/router.js";
import { DBConnection } from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Establish database connection
DBConnection();

// Configure middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Set up routes
app.use("/", router);

// Start server
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';  // Ensure to bind to all network interfaces
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
