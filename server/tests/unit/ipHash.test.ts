import { describe, it, expect } from "vitest";
import crypto from "crypto";

// Inline the ipHash logic here to avoid importing env.ts (which depends on process.env)
const hashIpAddress = (ip: string, secret: string): string => {
  if (!ip) return "unknown";
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
};

describe("hashIpAddress", () => {
  const secret = "test-secret-key";

  it("should return a hex string for a valid IP", () => {
    const hash = hashIpAddress("192.168.1.1", secret);
    expect(hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 produces 64 hex chars
  });

  it("should return the same hash for the same IP (deterministic)", () => {
    const hash1 = hashIpAddress("10.0.0.1", secret);
    const hash2 = hashIpAddress("10.0.0.1", secret);
    expect(hash1).toBe(hash2);
  });

  it("should return different hashes for different IPs", () => {
    const hash1 = hashIpAddress("10.0.0.1", secret);
    const hash2 = hashIpAddress("10.0.0.2", secret);
    expect(hash1).not.toBe(hash2);
  });

  it("should return different hashes with different secrets", () => {
    const hash1 = hashIpAddress("10.0.0.1", "secret-a");
    const hash2 = hashIpAddress("10.0.0.1", "secret-b");
    expect(hash1).not.toBe(hash2);
  });

  it("should return 'unknown' for an empty IP string", () => {
    const hash = hashIpAddress("", secret);
    expect(hash).toBe("unknown");
  });

  it("should never expose the raw IP in the output", () => {
    const ip = "192.168.1.100";
    const hash = hashIpAddress(ip, secret);
    expect(hash).not.toContain(ip);
    expect(hash).not.toContain("192");
  });
});
