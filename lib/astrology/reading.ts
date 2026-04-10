import { type ClaudeMessage, callClaude } from "@/lib/astrology/claude-client";
import { classifyOutput } from "@/lib/astrology/output-classifier";
import { loadPrompt, renderPrompt } from "@/lib/astrology/prompts/loader";
import type {
  ChatVars,
  HoroscopeVars,
  PersonalReadingVars,
  PromptType,
  TarotVars,
  WeeklyHoroscopeVars,
} from "@/lib/astrology/prompts/types";
import { getRejectionMessage, sanitizeInput } from "@/lib/astrology/sanitizer";

const PROMPT_VERSION = "v1.0";
// ロケールは i18n/request.ts と同期。現在 ja 固定（ポートフォリオ用途）
const LOCALE = "ja" as const;

export interface ReadingResult {
  readonly content: string;
  readonly promptVersion: string;
  readonly model: string;
  readonly tokenUsage: {
    readonly input: number;
    readonly output: number;
  };
  readonly rejected?: boolean;
  readonly rejectionReason?: string;
}

function localizedPromptName(name: string): string {
  return LOCALE === "ja" ? `${name}-ja` : name;
}

function buildSystemPrompt(promptType: PromptType): string {
  const base = loadPrompt(localizedPromptName("base"));
  const typePrompt = loadPrompt(localizedPromptName(promptType));
  const outputFormat = loadPrompt(LOCALE === "ja" ? "output-format-ja" : "output-format-en");
  return `${base}\n\n${typePrompt}\n\n${outputFormat}`;
}

function formatTarotCards(
  cards: ReadonlyArray<{ name: string; position: string; orientation: string }>,
): string {
  if (LOCALE === "ja") {
    return cards
      .map((c, i) => `カード${i + 1}: ${c.name} — ポジション: ${c.position}、向き: ${c.orientation}`)
      .join("\n");
  }
  return cards
    .map((c, i) => `Card ${i + 1}: ${c.name} (${c.position}) — ${c.orientation}`)
    .join("\n");
}

export async function generateHoroscope(vars: HoroscopeVars): Promise<ReadingResult> {
  const systemPrompt = buildSystemPrompt("horoscope");
  const userMessage = renderPrompt(loadPrompt(localizedPromptName("horoscope")), {
    sign: vars.sign,
    date: vars.date,
    day_of_week: vars.day_of_week,
  });

  const response = await callClaude({ systemPrompt, userMessage });

  const classification = classifyOutput(response.content);
  const content = classification.safe ? response.content : (classification.replacement ?? "");

  return {
    content,
    promptVersion: PROMPT_VERSION,
    model: response.model,
    tokenUsage: { input: response.usage.inputTokens, output: response.usage.outputTokens },
    rejected: !classification.safe,
    rejectionReason: classification.category,
  };
}

export async function generateWeeklyHoroscope(vars: WeeklyHoroscopeVars): Promise<ReadingResult> {
  const systemPrompt = buildSystemPrompt("weekly-horoscope");
  const userMessage = renderPrompt(loadPrompt(localizedPromptName("weekly-horoscope")), {
    sign: vars.sign,
    week_start: vars.week_start,
    week_end: vars.week_end,
  });

  const response = await callClaude({ systemPrompt, userMessage });

  const classification = classifyOutput(response.content);
  const content = classification.safe ? response.content : (classification.replacement ?? "");

  return {
    content,
    promptVersion: PROMPT_VERSION,
    model: response.model,
    tokenUsage: { input: response.usage.inputTokens, output: response.usage.outputTokens },
    rejected: !classification.safe,
    rejectionReason: classification.category,
  };
}

export async function generatePersonalReading(vars: PersonalReadingVars): Promise<ReadingResult> {
  const systemPrompt = buildSystemPrompt("personal-reading");

  const templateVars: Record<string, string> = {
    sign: vars.sign,
    birth_date: vars.birth_date,
  };
  if (vars.question) templateVars.question = vars.question;
  if (vars.reading_history_summary) {
    templateVars.reading_history_summary = vars.reading_history_summary;
  }

  const sanitized = vars.question ? sanitizeInput(vars.question) : { safe: true, sanitized: "" };
  if (!sanitized.safe) {
    return {
      content: getRejectionMessage(sanitized.reason ?? "unknown"),
      promptVersion: PROMPT_VERSION,
      model: "none",
      tokenUsage: { input: 0, output: 0 },
      rejected: true,
      rejectionReason: sanitized.reason,
    };
  }

  const userMessage = renderPrompt(loadPrompt(localizedPromptName("personal-reading")), templateVars);
  const response = await callClaude({ systemPrompt, userMessage });

  const classification = classifyOutput(response.content);
  const content = classification.safe ? response.content : (classification.replacement ?? "");

  return {
    content,
    promptVersion: PROMPT_VERSION,
    model: response.model,
    tokenUsage: { input: response.usage.inputTokens, output: response.usage.outputTokens },
    rejected: !classification.safe,
    rejectionReason: classification.category,
  };
}

export async function generateTarotReading(vars: TarotVars): Promise<ReadingResult> {
  const systemPrompt = buildSystemPrompt("tarot");

  const sanitized = vars.question ? sanitizeInput(vars.question) : { safe: true, sanitized: "" };
  if (!sanitized.safe) {
    return {
      content: getRejectionMessage(sanitized.reason ?? "unknown"),
      promptVersion: PROMPT_VERSION,
      model: "none",
      tokenUsage: { input: 0, output: 0 },
      rejected: true,
      rejectionReason: sanitized.reason,
    };
  }

  const templateVars: Record<string, string> = {
    cards: formatTarotCards(vars.cards),
    question: vars.question ?? "（特になし）",
  };

  const userMessage = renderPrompt(loadPrompt(localizedPromptName("tarot")), templateVars);
  const response = await callClaude({ systemPrompt, userMessage });

  const classification = classifyOutput(response.content);
  const content = classification.safe ? response.content : (classification.replacement ?? "");

  return {
    content,
    promptVersion: PROMPT_VERSION,
    model: response.model,
    tokenUsage: { input: response.usage.inputTokens, output: response.usage.outputTokens },
    rejected: !classification.safe,
    rejectionReason: classification.category,
  };
}

export async function generateChatResponse(
  vars: ChatVars,
  conversationHistory?: ReadonlyArray<ClaudeMessage>,
): Promise<ReadingResult> {
  const systemPrompt = buildSystemPrompt("chat");

  const sanitized = sanitizeInput(vars.user_message);
  if (!sanitized.safe) {
    return {
      content: getRejectionMessage(sanitized.reason ?? "unknown"),
      promptVersion: PROMPT_VERSION,
      model: "none",
      tokenUsage: { input: 0, output: 0 },
      rejected: true,
      rejectionReason: sanitized.reason,
    };
  }

  const templateVars: Record<string, string> = {
    sign: vars.sign,
    user_message: sanitized.sanitized,
  };
  if (vars.conversation_history) templateVars.conversation_history = vars.conversation_history;

  const userMessage = renderPrompt(loadPrompt(localizedPromptName("chat")), templateVars);
  const response = await callClaude({
    systemPrompt,
    userMessage,
    conversationHistory,
  });

  const classification = classifyOutput(response.content);
  const content = classification.safe ? response.content : (classification.replacement ?? "");

  return {
    content,
    promptVersion: PROMPT_VERSION,
    model: response.model,
    tokenUsage: { input: response.usage.inputTokens, output: response.usage.outputTokens },
    rejected: !classification.safe,
    rejectionReason: classification.category,
  };
}
