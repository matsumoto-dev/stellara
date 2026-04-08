export interface TarotCard {
  readonly name: string;
  readonly arcana: "major" | "minor";
  readonly suit?: "wands" | "cups" | "swords" | "pentacles";
}

export const MAJOR_ARCANA: readonly TarotCard[] = [
  { name: "The Fool", arcana: "major" },
  { name: "The Magician", arcana: "major" },
  { name: "The High Priestess", arcana: "major" },
  { name: "The Empress", arcana: "major" },
  { name: "The Emperor", arcana: "major" },
  { name: "The Hierophant", arcana: "major" },
  { name: "The Lovers", arcana: "major" },
  { name: "The Chariot", arcana: "major" },
  { name: "Strength", arcana: "major" },
  { name: "The Hermit", arcana: "major" },
  { name: "Wheel of Fortune", arcana: "major" },
  { name: "Justice", arcana: "major" },
  { name: "The Hanged Man", arcana: "major" },
  { name: "Death", arcana: "major" },
  { name: "Temperance", arcana: "major" },
  { name: "The Devil", arcana: "major" },
  { name: "The Tower", arcana: "major" },
  { name: "The Star", arcana: "major" },
  { name: "The Moon", arcana: "major" },
  { name: "The Sun", arcana: "major" },
  { name: "Judgement", arcana: "major" },
  { name: "The World", arcana: "major" },
];

const MINOR_RANKS = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Page",
  "Knight",
  "Queen",
  "King",
] as const;

const SUITS = ["wands", "cups", "swords", "pentacles"] as const;

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  for (const suit of SUITS) {
    for (const rank of MINOR_RANKS) {
      cards.push({
        name: `${rank} of ${suit.charAt(0).toUpperCase()}${suit.slice(1)}`,
        arcana: "minor",
        suit,
      });
    }
  }
  return cards;
}

export const MINOR_ARCANA: readonly TarotCard[] = generateMinorArcana();

export const FULL_DECK: readonly TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export type TarotOrientation = "upright" | "reversed";
export type TarotPosition = "past" | "present" | "future" | "single";

export interface DrawnCard {
  readonly card: TarotCard;
  readonly orientation: TarotOrientation;
  readonly position: TarotPosition;
}

export function drawCards(count: 1 | 3): readonly DrawnCard[] {
  const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
  const positions: TarotPosition[] = count === 1 ? ["single"] : ["past", "present", "future"];

  return shuffled.slice(0, count).map((card, i) => ({
    card,
    orientation: Math.random() > 0.5 ? "upright" : "reversed",
    position: positions[i],
  }));
}
