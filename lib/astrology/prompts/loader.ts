import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const PROMPTS_DIR = resolve(process.cwd(), "prompts");

const cache = new Map<string, string>();

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
