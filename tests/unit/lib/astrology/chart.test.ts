import { describe, expect, it } from "vitest";
import { getSunSign } from "@/lib/astrology/chart";

describe("getSunSign", () => {
  it.each([
    { date: "1990-03-25", expected: "aries" },
    { date: "1990-04-19", expected: "aries" },
    { date: "1990-04-20", expected: "taurus" },
    { date: "1990-05-20", expected: "taurus" },
    { date: "1990-05-21", expected: "gemini" },
    { date: "1990-06-20", expected: "gemini" },
    { date: "1990-06-21", expected: "cancer" },
    { date: "1990-07-22", expected: "cancer" },
    { date: "1990-07-23", expected: "leo" },
    { date: "1990-08-22", expected: "leo" },
    { date: "1990-08-23", expected: "virgo" },
    { date: "1990-09-22", expected: "virgo" },
    { date: "1990-09-23", expected: "libra" },
    { date: "1990-10-22", expected: "libra" },
    { date: "1990-10-23", expected: "scorpio" },
    { date: "1990-11-21", expected: "scorpio" },
    { date: "1990-11-22", expected: "sagittarius" },
    { date: "1990-12-21", expected: "sagittarius" },
    { date: "1990-12-22", expected: "capricorn" },
    { date: "1990-12-31", expected: "capricorn" },
    { date: "1990-01-01", expected: "capricorn" },
    { date: "1990-01-19", expected: "capricorn" },
    { date: "1990-01-20", expected: "aquarius" },
    { date: "1990-02-18", expected: "aquarius" },
    { date: "1990-02-19", expected: "pisces" },
    { date: "1990-03-20", expected: "pisces" },
    { date: "1990-03-21", expected: "aries" },
  ])("should return $expected for $date", ({ date, expected }) => {
    expect(getSunSign(date)).toBe(expected);
  });

  it("should throw for invalid date format", () => {
    expect(() => getSunSign("25/03/1990")).toThrow("Invalid date format");
    expect(() => getSunSign("1990-3-25")).toThrow("Invalid date format");
    expect(() => getSunSign("")).toThrow("Invalid date format");
  });

  it("should throw for invalid month/day", () => {
    expect(() => getSunSign("1990-13-01")).toThrow("Invalid date");
    expect(() => getSunSign("1990-00-01")).toThrow("Invalid date");
  });
});
