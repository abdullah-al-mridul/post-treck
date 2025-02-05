import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const server = express();

// Middlewares
server.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
server.use(cookieParser());
server.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/users", userRoutes);
server.use("/api/posts", postRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/chats", chatRoutes);

// Error handling middleware
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).json({
    success: false,
    status,
    message,
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
