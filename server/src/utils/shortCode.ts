import crypto from "crypto";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const RESERVED_SLUGS = new Set([
  "api", "auth", "dashboard", "login", "register", "admin", "bio", "r", "settings", "analytics", "health", "docs"
]);

export const generateShortCode = (length: number = 6): string => {
  let code = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += CHARS[randomBytes[i] % CHARS.length];
  }
  return code;
};

export const isReservedSlug = (slug: string): boolean => {
  return RESERVED_SLUGS.has(slug.toLowerCase());
};
