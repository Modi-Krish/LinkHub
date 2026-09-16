import crypto from "crypto";
import { env } from "../config/env";

export const hashIpAddress = (ip: string): string => {
  if (!ip) return "unknown";
  return crypto.createHmac("sha256", env.IP_HASH_SECRET).update(ip).digest("hex");
};
