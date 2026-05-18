import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Anthropic SDK as a class constructor
const mockCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate };
    },
  };
});

describe("callClaude", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    mockCreate.mockReset();
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-key");
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_abc");
  });

  it("should return content from a successful API call", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "The stars align for you today." }],
      model: "claude-haiku-4-5-20241022",
      usage: { input_tokens: 100, output_tokens: 50 },
    });

    const { callClaude } = await import("@/lib/astrology/claude-client");
    const result = await callClaude({
      systemPrompt: "You are an astrologer.",
      userMessage: "What's my horoscope?",
    });

    expect(result.content).toBe("The stars align for you today.");
    expect(result.model).toBe("claude-haiku-4-5-20241022");
    expect(result.usage.inputTokens).toBe(100);
    expect(result.usage.outputTokens).toBe(50);
  });

  it("should pass conversation history to API", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
      model: "claude-haiku-4-5-20241022",
      usage: { input_tokens: 200, output_tokens: 50 },
    });

    const { callClaude } = await import("@/lib/astrology/claude-client");
    await callClaude({
      systemPrompt: "System",
      userMessage: "Follow up question",
      conversationHistory: [
        { role: "user", content: "First question" },
        { role: "assistant", content: "First answer" },
      ],
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          { role: "user", content: "First question" },
          { role: "assistant", content: "First answer" },
          { role: "user", content: "Follow up question" },
        ],
      }),
    );
  });

  it("should retry on failure and succeed", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API timeout")).mockResolvedValueOnce({
      content: [{ type: "text", text: "Success on retry" }],
      model: "claude-haiku-4-5-20241022",
      usage: { input_tokens: 100, output_tokens: 50 },
    });

    const { callClaude } = await import("@/lib/astrology/claude-client");
    const result = await callClaude({
      systemPrompt: "System",
      userMessage: "Test",
    });

    expect(result.content).toBe("Success on retry");
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it("should throw after max retries exhausted", async () => {
    mockCreate.mockRejectedValue(new Error("Persistent failure"));

    const { callClaude } = await import("@/lib/astrology/claude-client");
    await expect(
      callClaude({
        systemPrompt: "System",
        userMessage: "Test",
      }),
    ).rejects.toThrow("Persistent failure");

    expect(mockCreate).toHaveBeenCalledTimes(3);
  });

  it("should throw if no text content in response", async () => {
    mockCreate.mockResolvedValue({
      content: [],
      model: "claude-haiku-4-5-20241022",
      usage: { input_tokens: 100, output_tokens: 0 },
    });

    const { callClaude } = await import("@/lib/astrology/claude-client");
    await expect(
      callClaude({
        systemPrompt: "System",
        userMessage: "Test",
      }),
    ).rejects.toThrow("No text content");
  });

  it("should use custom model when specified", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Response" }],
      model: "claude-sonnet-4-6-20250514",
      usage: { input_tokens: 100, output_tokens: 50 },
    });

    const { callClaude } = await import("@/lib/astrology/claude-client");
    await callClaude({
      systemPrompt: "System",
      userMessage: "Test",
      model: "claude-sonnet-4-6-20250514",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: "claude-sonnet-4-6-20250514" }),
    );
  });
});
