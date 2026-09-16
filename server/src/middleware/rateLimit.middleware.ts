import { rateLimit } from "express-rate-limit";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    handler: (req, res, next) => {
      next(new AppError(429, "RATE_LIMIT_EXCEEDED", message));
    },
  });
};

export const linkCreateLimiter = createRateLimiter(
  env.LINK_CREATE_RATE_WINDOW_MS,
  env.LINK_CREATE_RATE_MAX,
  "Too many links created. Please try again later."
);

export const redirectLimiter = createRateLimiter(
  env.REDIRECT_RATE_WINDOW_MS,
  env.REDIRECT_RATE_MAX,
  "Too many redirect requests. Please try again later."
);

export const authLimiter = createRateLimiter(
  env.AUTH_RATE_WINDOW_MS,
  env.AUTH_RATE_MAX,
  "Too many authentication attempts. Please try again later."
);
