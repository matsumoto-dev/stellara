const UNSAFE_PATTERNS: ReadonlyArray<{ pattern: RegExp; category: string }> = [
  // Self-harm / suicide promotion
  { pattern: /you\s+should\s+(kill|harm|hurt)\s+yourself/i, category: "self_harm" },
  { pattern: /ways?\s+to\s+(commit\s+suicide|end\s+your\s+life)/i, category: "self_harm" },
  { pattern: /encourage.*\b(suicide|self[- ]harm)\b/i, category: "self_harm" },

  // Medical diagnosis
  {
    pattern: /you\s+(have|suffer\s+from)\s+(cancer|diabetes|depression|anxiety\s+disorder)/i,
    category: "medical_diagnosis",
  },
  { pattern: /i\s+diagnose\s+you\s+with/i, category: "medical_diagnosis" },
  {
    pattern: /prescribe\s+(you\s+)?(\w+\s+)?(medication|medicine|drug)/i,
    category: "medical_diagnosis",
  },

  // Financial advice
  {
    pattern: /you\s+should\s+(invest|buy|sell)\s+(stocks?|crypto|bitcoin|shares)/i,
    category: "financial_advice",
  },
  { pattern: /guaranteed\s+(return|profit|income)/i, category: "financial_advice" },

  // Discriminatory content
  {
    pattern: /\b(race|ethnicity|religion)\s+is\s+(superior|inferior)/i,
    category: "discrimination",
  },
  { pattern: /\b(hate|despise)\s+all\s+\w+\s+(people|persons)/i, category: "discrimination" },
];

const SAFE_REPLACEMENT =
  "The stars suggest taking a gentle pause here. For matters beyond astrology, please consult a qualified professional. Is there something about your cosmic journey I can help with?";

export interface ClassifyResult {
  readonly safe: boolean;
  readonly category?: string;
  readonly replacement?: string;
}

/**
 * Layer 3: Output classifier (keyword-based for Phase 1).
 * Checks Claude's response for harmful content categories.
 */
export function classifyOutput(content: string): ClassifyResult {
  for (const { pattern, category } of UNSAFE_PATTERNS) {
    if (pattern.test(content)) {
      return { safe: false, category, replacement: SAFE_REPLACEMENT };
    }
  }
  return { safe: true };
}
