import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "Access secret is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "Refresh secret is required"),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z.string().transform((val) => val === "true").default("false" as any),
  IP_HASH_SECRET: z.string().min(1, "IP hash secret is required"),
  LINK_CREATE_RATE_WINDOW_MS: z.coerce.number().default(900000),
  LINK_CREATE_RATE_MAX: z.coerce.number().default(100),
  REDIRECT_RATE_WINDOW_MS: z.coerce.number().default(60000),
  REDIRECT_RATE_MAX: z.coerce.number().default(300),
  AUTH_RATE_WINDOW_MS: z.coerce.number().default(900000),
  AUTH_RATE_MAX: z.coerce.number().default(20),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
