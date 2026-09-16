import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors";
import { errorHandler } from "./middleware/error.middleware";

// Routes
import authRoutes from "./routes/auth.routes";
import linkRoutes from "./routes/link.routes";
import redirectRoutes from "./routes/redirect.routes";
import analyticsRoutes from "./routes/analytics.routes";
import bioRoutes from "./routes/bio.routes";
import publicRoutes from "./routes/public.routes";

export const app = express();

// Security Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/bio", bioRoutes);
app.use("/api/v1/public", publicRoutes);

// Public Redirect Route
app.use("/", redirectRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
    },
  });
});

// Global Error Handler
app.use(errorHandler);
