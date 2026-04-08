import { describe, expect, it } from "vitest";
import {
  chatVarsSchema,
  getPromptVarsSchema,
  horoscopeVarsSchema,
  PROMPT_TYPES,
  personalReadingVarsSchema,
  tarotVarsSchema,
  weeklyHoroscopeVarsSchema,
} from "@/lib/astrology/prompts/types";

describe("PROMPT_TYPES", () => {
  it("should contain all 5 prompt types", () => {
    expect(PROMPT_TYPES).toEqual([
      "horoscope",
      "weekly-horoscope",
      "personal-reading",
      "tarot",
      "chat",
    ]);
  });
});

describe("horoscopeVarsSchema", () => {
  it("should accept valid horoscope variables", () => {
    const result = horoscopeVarsSchema.safeParse({
      sign: "aries",
      date: "2026-04-02",
      day_of_week: "Thursday",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid sign", () => {
    const result = horoscopeVarsSchema.safeParse({
      sign: "dragon",
      date: "2026-04-02",
      day_of_week: "Thursday",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing date", () => {
    const result = horoscopeVarsSchema.safeParse({
      sign: "aries",
      day_of_week: "Thursday",
    });
    expect(result.success).toBe(false);
  });
});

describe("personalReadingVarsSchema", () => {
  it("should accept valid personal reading variables", () => {
    const result = personalReadingVarsSchema.safeParse({
      sign: "taurus",
      birth_date: "1990-05-15",
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional question and history", () => {
    const result = personalReadingVarsSchema.safeParse({
      sign: "taurus",
      birth_date: "1990-05-15",
      question: "What about my career?",
      reading_history_summary: "Previously asked about relationships.",
    });
    expect(result.success).toBe(true);
  });
});

describe("tarotVarsSchema", () => {
  it("should accept single card (Free tier)", () => {
    const result = tarotVarsSchema.safeParse({
      cards: [{ name: "The Fool", position: "present", orientation: "upright" }],
    });
    expect(result.success).toBe(true);
  });

  it("should accept 3-card spread (Pro tier)", () => {
    const result = tarotVarsSchema.safeParse({
      cards: [
        { name: "The Fool", position: "past", orientation: "upright" },
        { name: "The Tower", position: "present", orientation: "reversed" },
        { name: "The Star", position: "future", orientation: "upright" },
      ],
      question: "What should I focus on?",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty cards array", () => {
    const result = tarotVarsSchema.safeParse({
      cards: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid orientation", () => {
    const result = tarotVarsSchema.safeParse({
      cards: [{ name: "The Fool", position: "present", orientation: "sideways" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("chatVarsSchema", () => {
  it("should accept valid chat variables", () => {
    const result = chatVarsSchema.safeParse({
      sign: "gemini",
      user_message: "What does Mercury retrograde mean for me?",
      conversation_history: "User asked about love. Assistant replied...",
    });
    expect(result.success).toBe(true);
  });

  it("should accept without conversation history", () => {
    const result = chatVarsSchema.safeParse({
      sign: "gemini",
      user_message: "Tell me about my stars today.",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty user message", () => {
    const result = chatVarsSchema.safeParse({
      sign: "gemini",
      user_message: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("weeklyHoroscopeVarsSchema", () => {
  it("should accept valid weekly horoscope variables", () => {
    const result = weeklyHoroscopeVarsSchema.safeParse({
      sign: "aries",
      week_start: "2026-04-06",
      week_end: "2026-04-12",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid sign", () => {
    const result = weeklyHoroscopeVarsSchema.safeParse({
      sign: "dragon",
      week_start: "2026-04-06",
      week_end: "2026-04-12",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing week_end", () => {
    const result = weeklyHoroscopeVarsSchema.safeParse({
      sign: "aries",
      week_start: "2026-04-06",
    });
    expect(result.success).toBe(false);
  });
});

describe("getPromptVarsSchema", () => {
  it("should return horoscopeVarsSchema for horoscope type", () => {
    const schema = getPromptVarsSchema("horoscope");
    expect(schema).toBe(horoscopeVarsSchema);
  });

  it("should return personalReadingVarsSchema for personal-reading type", () => {
    const schema = getPromptVarsSchema("personal-reading");
    expect(schema).toBe(personalReadingVarsSchema);
  });

  it("should return tarotVarsSchema for tarot type", () => {
    const schema = getPromptVarsSchema("tarot");
    expect(schema).toBe(tarotVarsSchema);
  });

  it("should return chatVarsSchema for chat type", () => {
    const schema = getPromptVarsSchema("chat");
    expect(schema).toBe(chatVarsSchema);
  });

  it("should return weeklyHoroscopeVarsSchema for weekly-horoscope type", () => {
    const schema = getPromptVarsSchema("weekly-horoscope");
    expect(schema).toBe(weeklyHoroscopeVarsSchema);
  });
});
