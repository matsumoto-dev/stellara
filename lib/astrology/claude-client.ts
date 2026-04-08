import Anthropic from "@anthropic-ai/sdk";
import { getServerEnv } from "@/lib/config";

const DEFAULT_MODEL = "claude-haiku-4-5-20241022";
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

export interface ClaudeMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface ClaudeRequest {
  readonly systemPrompt: string;
  readonly userMessage: string;
  readonly conversationHistory?: ReadonlyArray<ClaudeMessage>;
  readonly model?: string;
  readonly maxTokens?: number;
}

export interface ClaudeResponse {
  readonly content: string;
  readonly model: string;
  readonly usage: {
    readonly inputTokens: number;
    readonly outputTokens: number;
  };
}

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  const env = getServerEnv();
  if (!env?.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  cachedClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return cachedClient;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call Claude API with retry logic (exponential backoff).
 */
export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  const client = getClient();
  const model = request.model ?? DEFAULT_MODEL;
  const maxTokens = request.maxTokens ?? 2048;

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  if (request.conversationHistory) {
    for (const msg of request.conversationHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }
  messages.push({ role: "user", content: request.userMessage });

  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: request.systemPrompt,
        messages,
      });

      const textContent = response.content.find((block) => block.type === "text");
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text content in Claude response");
      }

      return {
        content: textContent.text,
        model: response.model,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAYS[attempt]);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Claude API call failed after retries");
}
