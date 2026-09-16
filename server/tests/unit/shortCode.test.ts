import { describe, it, expect } from "vitest";
import { generateShortCode, isReservedSlug } from "../../src/utils/shortCode";

describe("generateShortCode", () => {
  it("should generate a code of 6 characters by default", () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
  });

  it("should generate a code of the specified length", () => {
    const code = generateShortCode(8);
    expect(code).toHaveLength(8);
  });

  it("should only contain alphanumeric characters (a-z A-Z 0-9)", () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
  });

  it("should generate unique codes on successive calls", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    // With 62^6 possibilities, 100 codes should all be unique
    expect(codes.size).toBe(100);
  });
});

describe("isReservedSlug", () => {
  it("should return true for reserved slugs", () => {
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("auth")).toBe(true);
    expect(isReservedSlug("dashboard")).toBe(true);
    expect(isReservedSlug("login")).toBe(true);
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("bio")).toBe(true);
    expect(isReservedSlug("r")).toBe(true);
  });

  it("should return true regardless of casing", () => {
    expect(isReservedSlug("API")).toBe(true);
    expect(isReservedSlug("Auth")).toBe(true);
    expect(isReservedSlug("DASHBOARD")).toBe(true);
  });

  it("should return false for non-reserved slugs", () => {
    expect(isReservedSlug("my-link")).toBe(false);
    expect(isReservedSlug("summer-sale")).toBe(false);
    expect(isReservedSlug("portfolio")).toBe(false);
    expect(isReservedSlug("abc123")).toBe(false);
  });
});
