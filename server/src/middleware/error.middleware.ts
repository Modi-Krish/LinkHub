import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof AppError)) {
    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val: any) => val.message).join(", ");
      error = new AppError(400, "VALIDATION_ERROR", message);
    }
    // Handle Mongoose Duplicate Key Error
    else if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      error = new AppError(409, "DUPLICATE_RESOURCE", `The ${field} is already in use.`);
    }
    // Handle JWT Errors
    else if (err.name === "JsonWebTokenError") {
      error = new AppError(401, "INVALID_TOKEN", "Invalid token. Please log in again.");
    } else if (err.name === "TokenExpiredError") {
      error = new AppError(401, "EXPIRED_TOKEN", "Your token has expired. Please log in again.");
    }
    // Default Server Error
    else {
      error = new AppError(500, "INTERNAL_SERVER_ERROR", "Something went wrong on the server.");
      console.error("ERROR 💥:", err);
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message,
    },
  });
};
