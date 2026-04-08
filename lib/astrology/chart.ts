import type { SunSign } from "@/lib/db/types";

/**
 * Zodiac date ranges (month, day) — inclusive start, inclusive end.
 * Uses tropical astrology standard dates.
 */
const ZODIAC_RANGES: ReadonlyArray<{
  sign: SunSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}> = [
  { sign: "capricorn", startMonth: 1, startDay: 1, endMonth: 1, endDay: 19 },
  { sign: "aquarius", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: "pisces", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { sign: "aries", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: "taurus", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: "gemini", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: "cancer", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: "leo", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: "virgo", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: "libra", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: "scorpio", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: "sagittarius", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: "capricorn", startMonth: 12, startDay: 22, endMonth: 12, endDay: 31 },
];

/**
 * Calculate sun sign from a birth date string (YYYY-MM-DD).
 * Uses simple date-range lookup (tropical astrology).
 * Phase 2 will add ephemeris-based calculation for moon/rising signs.
 */
export function getSunSign(birthDate: string): SunSign {
  const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid date format: ${birthDate}. Expected YYYY-MM-DD.`);
  }

  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid date: ${birthDate}`);
  }

  for (const range of ZODIAC_RANGES) {
    if (
      (month === range.startMonth && day >= range.startDay) ||
      (month === range.endMonth && day <= range.endDay)
    ) {
      // Handle ranges within same month
      if (range.startMonth === range.endMonth) {
        if (month === range.startMonth && day >= range.startDay && day <= range.endDay) {
          return range.sign;
        }
        continue;
      }
      return range.sign;
    }
  }

  throw new Error(`Could not determine sun sign for date: ${birthDate}`);
}
