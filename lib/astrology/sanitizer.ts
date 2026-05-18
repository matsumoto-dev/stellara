const MAX_INPUT_LENGTH = 8000; // ~2,000 tokens

const INJECTION_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
  { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, label: "instruction_override" },
  { pattern: /you\s+are\s+now\s+/i, label: "role_reassignment" },
  { pattern: /^system:/im, label: "role_impersonation" },
  { pattern: /^assistant:/im, label: "role_impersonation" },
  { pattern: /^human:/im, label: "role_impersonation" },
  { pattern: /<\|(?:im_start|im_end|system|endoftext)\|>/i, label: "special_token" },
  { pattern: /\[INST\]/i, label: "special_token" },
  { pattern: /<<SYS>>/i, label: "special_token" },
  { pattern: /do\s+not\s+follow\s+(your\s+)?instructions/i, label: "instruction_override" },
  { pattern: /disregard\s+(all\s+)?(previous|above|prior)/i, label: "instruction_override" },
  { pattern: /pretend\s+(you\s+are|to\s+be)\s+/i, label: "role_reassignment" },
  {
    pattern: /act\s+as\s+(if\s+you\s+are\s+)?a\s+(?!astrologer|stellara)/i,
    label: "role_reassignment",
  },
  { pattern: /forget\s+(everything|all|your\s+rules)/i, label: "instruction_override" },
  { pattern: /override\s+(your\s+)?(system|rules|instructions)/i, label: "instruction_override" },
];

export interface SanitizeResult {
  readonly safe: boolean;
  readonly sanitized: string;
  readonly reason?: string;
}

/**
 * Layer 1: Input sanitizer for prompt injection defense.
 * Checks user input for known injection patterns and length limits.
 */
export function sanitizeInput(input: string): SanitizeResult {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { safe: false, sanitized: "", reason: "empty_input" };
  }

  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      safe: false,
      sanitized: trimmed.slice(0, MAX_INPUT_LENGTH),
      reason: "input_too_long",
    };
  }

  for (const { pattern, label } of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { safe: false, sanitized: trimmed, reason: label };
    }
  }

  return { safe: true, sanitized: trimmed };
}

/**
 * Returns a user-friendly rejection message for unsafe input.
 */
export function getRejectionMessage(reason: string): string {
  switch (reason) {
    case "empty_input":
      return "It looks like your message was empty. Please ask me something about your stars!";
    case "input_too_long":
      return "Your message is a bit too long. Could you shorten it and try again?";
    default:
      return "I'm here to help with astrology and self-discovery. Could you rephrase your question about the stars?";
  }
}
