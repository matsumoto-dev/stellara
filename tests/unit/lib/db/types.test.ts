import { describe, expect, it } from "vitest";
import {
  consentRecordInsertSchema,
  dailyHoroscopeInsertSchema,
  profileInsertSchema,
  readingInsertSchema,
  SUN_SIGNS,
  sessionInsertSchema,
  sessionMessageInsertSchema,
} from "@/lib/db/types";

describe("SUN_SIGNS", () => {
  it("should contain exactly 12 zodiac signs", () => {
    expect(SUN_SIGNS).toHaveLength(12);
  });

  it("should contain all zodiac signs in order", () => {
    expect(SUN_SIGNS).toEqual([
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ]);
  });
});

describe("profileInsertSchema", () => {
  it("should accept valid profile data", () => {
    const result = profileInsertSchema.safeParse({
      id: "user-uuid-123",
      email: "test@example.com",
      birth_date: "1990-05-15",
      sun_sign: "taurus",
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional fields", () => {
    const result = profileInsertSchema.safeParse({
      id: "user-uuid-123",
      email: "test@example.com",
      birth_date: "1990-05-15",
      sun_sign: "taurus",
      display_name: "Star Gazer",
      birth_time: "14:30",
      birth_place: "Tokyo, Japan",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = profileInsertSchema.safeParse({
      id: "user-uuid-123",
      email: "not-an-email",
      birth_date: "1990-05-15",
      sun_sign: "taurus",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid sun sign", () => {
    const result = profileInsertSchema.safeParse({
      id: "user-uuid-123",
      email: "test@example.com",
      birth_date: "1990-05-15",
      sun_sign: "ophiuchus",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid date format", () => {
    const result = profileInsertSchema.safeParse({
      id: "user-uuid-123",
      email: "test@example.com",
      birth_date: "15/05/1990",
      sun_sign: "taurus",
    });
    expect(result.success).toBe(false);
  });

  it("should default plan to free", () => {
    const result = profileInsertSchema.parse({
      id: "user-uuid-123",
      email: "test@example.com",
      birth_date: "1990-05-15",
      sun_sign: "taurus",
    });
    expect(result.plan).toBe("free");
  });
});

describe("readingInsertSchema", () => {
  it("should accept valid reading data", () => {
    const result = readingInsertSchema.safeParse({
      user_id: "user-uuid-123",
      type: "personal",
      content: "The stars reveal...",
      prompt_version: "v1.0",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid reading type", () => {
    const result = readingInsertSchema.safeParse({
      user_id: "user-uuid-123",
      type: "fortune_cookie",
      content: "Something...",
      prompt_version: "v1.0",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty content", () => {
    const result = readingInsertSchema.safeParse({
      user_id: "user-uuid-123",
      type: "personal",
      content: "",
      prompt_version: "v1.0",
    });
    expect(result.success).toBe(false);
  });
});

describe("sessionInsertSchema", () => {
  it("should accept valid session data", () => {
    const result = sessionInsertSchema.safeParse({
      user_id: "user-uuid-123",
      type: "chat",
      turn_limit: 5,
    });
    expect(result.success).toBe(true);
  });

  it("should default turn_count to 0", () => {
    const result = sessionInsertSchema.parse({
      user_id: "user-uuid-123",
      type: "chat",
      turn_limit: 5,
    });
    expect(result.turn_count).toBe(0);
  });
});

describe("sessionMessageInsertSchema", () => {
  it("should accept valid message data", () => {
    const result = sessionMessageInsertSchema.safeParse({
      session_id: "session-uuid-123",
      role: "user",
      content: "What does my horoscope say?",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid role", () => {
    const result = sessionMessageInsertSchema.safeParse({
      session_id: "session-uuid-123",
      role: "system",
      content: "Injected message",
    });
    expect(result.success).toBe(false);
  });
});

describe("dailyHoroscopeInsertSchema", () => {
  it("should accept valid horoscope data", () => {
    const result = dailyHoroscopeInsertSchema.safeParse({
      sign: "aries",
      date: "2026-04-02",
      content: "Today the stars align...",
      prompt_version: "v1.0",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid sign", () => {
    const result = dailyHoroscopeInsertSchema.safeParse({
      sign: "dragon",
      date: "2026-04-02",
      content: "Some content",
      prompt_version: "v1.0",
    });
    expect(result.success).toBe(false);
  });
});

describe("consentRecordInsertSchema", () => {
  it("should accept valid consent record", () => {
    const result = consentRecordInsertSchema.safeParse({
      user_id: "user-uuid-123",
      consent_type: "terms_and_privacy",
      ip_address: "192.168.1.1",
    });
    expect(result.success).toBe(true);
  });

  it("should accept eu_art16m consent type", () => {
    const result = consentRecordInsertSchema.safeParse({
      user_id: "user-uuid-123",
      consent_type: "eu_art16m",
      ip_address: "10.0.0.1",
      country_code: "DE",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty ip_address", () => {
    const result = consentRecordInsertSchema.safeParse({
      user_id: "user-uuid-123",
      consent_type: "terms_and_privacy",
      ip_address: "",
    });
    expect(result.success).toBe(false);
  });
});
