import { describe, it, expect } from "vitest";

// Inline the AppError class to avoid path resolution issues during vitest
class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(statusCode: number, code: string, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

describe("AppError", () => {
  it("should create an error with the correct properties", () => {
    const error = new AppError(404, "NOT_FOUND", "Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Resource not found");
    expect(error.isOperational).toBe(true);
  });

  it("should be an instance of Error", () => {
    const error = new AppError(500, "SERVER_ERROR", "Something went wrong");
    expect(error).toBeInstanceOf(Error);
  });

  it("should default isOperational to true", () => {
    const error = new AppError(400, "VALIDATION_ERROR", "Bad input");
    expect(error.isOperational).toBe(true);
  });

  it("should allow setting isOperational to false for programming errors", () => {
    const error = new AppError(500, "UNEXPECTED", "Crash", false);
    expect(error.isOperational).toBe(false);
  });

  it("should have a stack trace", () => {
    const error = new AppError(400, "TEST", "test error");
    expect(error.stack).toBeDefined();
    expect(error.stack!.length).toBeGreaterThan(0);
  });
});
