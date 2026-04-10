import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const PROMPTS_DIR = resolve(process.cwd(), "prompts");

const cache = new Map<string, string>();

// Explicit file references so Next.js output file tracing includes them in
// serverless function bundles (Vercel). Without these static paths the dynamic
// `readFileSync(…${name}.md)` call is invisible to the tracer.
// biome-ignore format: keep compact
const _traceHint = [
  join(PROMPTS_DIR, "base.md"),          join(PROMPTS_DIR, "base-ja.md"),
  join(PROMPTS_DIR, "tarot.md"),         join(PROMPTS_DIR, "tarot-ja.md"),
  join(PROMPTS_DIR, "horoscope.md"),     join(PROMPTS_DIR, "horoscope-ja.md"),
  join(PROMPTS_DIR, "weekly-horoscope.md"), join(PROMPTS_DIR, "weekly-horoscope-ja.md"),
  join(PROMPTS_DIR, "personal-reading.md"), join(PROMPTS_DIR, "personal-reading-ja.md"),
  join(PROMPTS_DIR, "chat.md"),          join(PROMPTS_DIR, "chat-ja.md"),
  join(PROMPTS_DIR, "output-format-en.md"), join(PROMPTS_DIR, "output-format-ja.md"),
];
void _traceHint;

/**
 * Load a prompt file from the prompts/ directory by name (without .md extension).
 * Results are cached after first load.
 */
export function loadPrompt(name: string): string {
  const cached = cache.get(name);
  if (cached) return cached;

  const filePath = resolve(PROMPTS_DIR, `${name}.md`);
  const content = readFileSync(filePath, "utf-8");
  cache.set(name, content);
  return content;
}

/**
 * Replace {{variable}} placeholders in a template string with provided values.
 * Unmatched variables are left as-is.
 */
export function renderPrompt(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
