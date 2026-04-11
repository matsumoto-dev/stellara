/**
 * Section tag labels for reading output parser.
 * Tags like [OverallEnergy] in Claude's response get mapped to these Japanese headings.
 */
export const SECTION_LABELS: Record<string, string> = {
  // Tarot
  CardReveal: "カードの啓示",
  Synthesis: "統合リーディング",
  Guidance: "星からの導き",
  // Daily horoscope
  OverallEnergy: "今日のエネルギー",
  KeyTheme: "今日のテーマ",
  Advice: "アドバイス",
  LuckyElement: "ラッキーアイテム",
  // Personal reading
  Opening: "はじめに",
  Reading: "鑑定",
  Reflection: "あなたへの問いかけ",
};

export interface ParsedSection {
  readonly tag: string | null;
  readonly content: string;
}

/**
 * Parse Claude output with [SectionTag] markers into structured sections.
 * Text before the first tag is returned with tag=null.
 */
export function parseSections(raw: string): readonly ParsedSection[] {
  const regex = /\[(\w+)\]\s*/g;
  const sections: ParsedSection[] = [];
  let lastIndex = 0;
  let lastTag: string | null = null;
  let match: RegExpExecArray | null;

  match = regex.exec(raw);
  while (match !== null) {
    const textBefore = raw.slice(lastIndex, match.index).trim();
    if (textBefore) {
      sections.push({ tag: lastTag, content: textBefore });
    }
    lastTag = match[1];
    lastIndex = regex.lastIndex;
    match = regex.exec(raw);
  }

  const remaining = raw.slice(lastIndex).trim();
  if (remaining) {
    sections.push({ tag: lastTag, content: remaining });
  }

  return sections.length > 0 ? sections : [{ tag: null, content: raw }];
}
