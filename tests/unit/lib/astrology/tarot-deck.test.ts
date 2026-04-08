import { describe, expect, it } from "vitest";
import { drawCards, FULL_DECK, MAJOR_ARCANA, MINOR_ARCANA } from "@/lib/astrology/tarot-deck";

describe("tarot deck", () => {
  it("should have 22 major arcana cards", () => {
    expect(MAJOR_ARCANA).toHaveLength(22);
  });

  it("should have 56 minor arcana cards", () => {
    expect(MINOR_ARCANA).toHaveLength(56);
  });

  it("should have 78 total cards", () => {
    expect(FULL_DECK).toHaveLength(78);
  });

  it("should have unique card names", () => {
    const names = FULL_DECK.map((c) => c.name);
    expect(new Set(names).size).toBe(78);
  });

  it("minor arcana should have correct suits", () => {
    const suits = new Set(MINOR_ARCANA.map((c) => c.suit));
    expect(suits).toEqual(new Set(["wands", "cups", "swords", "pentacles"]));
  });

  it("each suit should have 14 cards", () => {
    for (const suit of ["wands", "cups", "swords", "pentacles"] as const) {
      const suitCards = MINOR_ARCANA.filter((c) => c.suit === suit);
      expect(suitCards).toHaveLength(14);
    }
  });
});

describe("drawCards", () => {
  it("should draw 1 card with position single", () => {
    const cards = drawCards(1);
    expect(cards).toHaveLength(1);
    expect(cards[0].position).toBe("single");
  });

  it("should draw 3 cards with past/present/future positions", () => {
    const cards = drawCards(3);
    expect(cards).toHaveLength(3);
    expect(cards[0].position).toBe("past");
    expect(cards[1].position).toBe("present");
    expect(cards[2].position).toBe("future");
  });

  it("should assign upright or reversed orientation", () => {
    const cards = drawCards(3);
    for (const card of cards) {
      expect(["upright", "reversed"]).toContain(card.orientation);
    }
  });

  it("should draw different cards (no duplicates)", () => {
    const cards = drawCards(3);
    const names = cards.map((c) => c.card.name);
    expect(new Set(names).size).toBe(3);
  });
});
