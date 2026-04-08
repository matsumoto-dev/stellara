import { describe, expect, it } from "vitest";
import { loadPrompt, PROMPTS_DIR, renderPrompt } from "@/lib/astrology/prompts/loader";

describe("PROMPTS_DIR", () => {
  it("should point to the prompts directory", () => {
    expect(PROMPTS_DIR).toContain("prompts");
  });
});

describe("loadPrompt", () => {
  it("should load base.md", () => {
    const content = loadPrompt("base");
    expect(content).toContain("Stellara");
    expect(content.length).toBeGreaterThan(100);
  });

  it("should load horoscope.md", () => {
    const content = loadPrompt("horoscope");
    expect(content).toContain("{{sign}}");
    expect(content).toContain("{{date}}");
  });

  it("should load output-format-en.md", () => {
    const content = loadPrompt("output-format-en");
    expect(content).toContain("OverallEnergy");
  });

  it("should throw for non-existent prompt", () => {
    expect(() => loadPrompt("nonexistent")).toThrow();
  });

  it("should cache loaded prompts", () => {
    const first = loadPrompt("base");
    const second = loadPrompt("base");
    expect(first).toBe(second);
  });
});

describe("renderPrompt", () => {
  it("should replace template variables", () => {
    const template = "Hello {{name}}, your sign is {{sign}}.";
    const result = renderPrompt(template, { name: "Alice", sign: "aries" });
    expect(result).toBe("Hello Alice, your sign is aries.");
  });

  it("should replace multiple occurrences of the same variable", () => {
    const template = "{{sign}} is {{sign}}.";
    const result = renderPrompt(template, { sign: "leo" });
    expect(result).toBe("leo is leo.");
  });

  it("should leave unmatched variables as-is", () => {
    const template = "Hello {{name}}, today is {{date}}.";
    const result = renderPrompt(template, { name: "Bob" });
    expect(result).toBe("Hello Bob, today is {{date}}.");
  });

  it("should handle empty variables object", () => {
    const template = "No variables here.";
    const result = renderPrompt(template, {});
    expect(result).toBe("No variables here.");
  });
});

describe("prompt content validation", () => {
  it("base.md should contain safety guardrails", () => {
    const content = loadPrompt("base");
    expect(content.toLowerCase()).toContain("entertainment");
    expect(content.toLowerCase()).toContain("never");
  });

  it("base.md should contain prompt injection defense", () => {
    const content = loadPrompt("base");
    expect(content.toLowerCase()).toMatch(/ignore|inject|instruct/);
  });
});
