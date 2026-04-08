import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/astrology/claude-client", () => ({
  callClaude: vi.fn(),
}));

describe("generateWeeklyHoroscope", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should generate a weekly horoscope reading", async () => {
    const { callClaude } = await import("@/lib/astrology/claude-client");
    vi.mocked(callClaude).mockResolvedValueOnce({
      content:
        "[WeeklyOverview] Aries enters a powerful week... [MajorTheme] Career momentum builds...",
      model: "claude-haiku-4-5-20241022",
      usage: { inputTokens: 600, outputTokens: 400 },
    });

    const { generateWeeklyHoroscope } = await import("@/lib/astrology/reading");
    const result = await generateWeeklyHoroscope({
      sign: "aries",
      week_start: "2026-04-06",
      week_end: "2026-04-12",
    });

    expect(result.content).toContain("Aries");
    expect(result.promptVersion).toBe("v1.0");
    expect(result.model).toBe("claude-haiku-4-5-20241022");
    expect(result.tokenUsage.input).toBe(600);
    expect(result.tokenUsage.output).toBe(400);
    expect(result.rejected).toBeFalsy();
  });

  it("should replace unsafe weekly output with safe message", async () => {
    const { callClaude } = await import("@/lib/astrology/claude-client");
    vi.mocked(callClaude).mockResolvedValueOnce({
      content: "this week you should harm yourself because the stars say so",
      model: "claude-haiku-4-5-20241022",
      usage: { inputTokens: 500, outputTokens: 100 },
    });

    const { generateWeeklyHoroscope } = await import("@/lib/astrology/reading");
    const result = await generateWeeklyHoroscope({
      sign: "aries",
      week_start: "2026-04-06",
      week_end: "2026-04-12",
    });

    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toBe("self_harm");
    expect(result.content).toContain("qualified professional");
  });

  it("should pass correct variables to the prompt", async () => {
    const { callClaude } = await import("@/lib/astrology/claude-client");
    const mockCallClaude = vi.mocked(callClaude);
    mockCallClaude.mockResolvedValueOnce({
      content: "Taurus weekly reading...",
      model: "claude-haiku-4-5-20241022",
      usage: { inputTokens: 550, outputTokens: 350 },
    });

    const { generateWeeklyHoroscope } = await import("@/lib/astrology/reading");
    await generateWeeklyHoroscope({
      sign: "taurus",
      week_start: "2026-04-06",
      week_end: "2026-04-12",
    });

    expect(mockCallClaude).toHaveBeenCalledOnce();
    const callArgs = mockCallClaude.mock.calls[0][0];
    expect(callArgs.userMessage).toContain("taurus");
    expect(callArgs.userMessage).toContain("2026-04-06");
    expect(callArgs.userMessage).toContain("2026-04-12");
  });
});
