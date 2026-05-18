import { describe, expect, it } from "vitest";
import { classifyOutput } from "@/lib/astrology/output-classifier";

describe("classifyOutput", () => {
  it("should pass safe astrology content", () => {
    const content =
      "The stars suggest a period of growth and transformation. Your ruling planet Venus brings harmony to relationships this week.";
    const result = classifyOutput(content);
    expect(result.safe).toBe(true);
    expect(result.category).toBeUndefined();
  });

  it("should detect self-harm promotion", () => {
    const content = "you should kill yourself because of the stars";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("self_harm");
    expect(result.replacement).toBeDefined();
  });

  it("should detect suicide-related content", () => {
    const content = "Here are ways to commit suicide based on your sign";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("self_harm");
  });

  it("should detect medical diagnosis", () => {
    const content = "Based on your chart, I diagnose you with clinical depression";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("medical_diagnosis");
  });

  it("should detect medication prescriptions", () => {
    const content = "I prescribe you medication for your anxiety";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("medical_diagnosis");
  });

  it("should detect financial advice", () => {
    const content = "You should invest in crypto stocks for guaranteed returns";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("financial_advice");
  });

  it("should detect discriminatory content", () => {
    const content = "This race is superior to others";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.category).toBe("discrimination");
  });

  it("should pass content with safe mentions of health topics", () => {
    const content =
      "The stars encourage you to prioritize your well-being. If you're feeling overwhelmed, consider speaking with a trusted friend or professional.";
    const result = classifyOutput(content);
    expect(result.safe).toBe(true);
  });

  it("should pass content about financial themes in astrology context", () => {
    const content =
      "Venus in your second house suggests a period of financial reflection. Focus on what truly brings you abundance.";
    const result = classifyOutput(content);
    expect(result.safe).toBe(true);
  });

  it("should provide replacement text for unsafe content", () => {
    const content = "You should harm yourself when Saturn aligns";
    const result = classifyOutput(content);
    expect(result.safe).toBe(false);
    expect(result.replacement).toContain("qualified professional");
  });
});
