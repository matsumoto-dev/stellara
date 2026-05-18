import { z } from "zod";
import { SUN_SIGNS } from "@/lib/db/types";

// --- Prompt Types ---

export const PROMPT_TYPES = ["horoscope", "weekly-horoscope", "personal-reading", "tarot", "chat"] as const;

export type PromptType = (typeof PROMPT_TYPES)[number];

// --- Variable Schemas ---

export const horoscopeVarsSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  date: z.string().min(1),
  day_of_week: z.string().min(1),
});

export const weeklyHoroscopeVarsSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  week_start: z.string().min(1),
  week_end: z.string().min(1),
});

export const personalReadingVarsSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  birth_date: z.string().min(1),
  question: z.string().optional(),
  reading_history_summary: z.string().optional(),
});

const tarotCardSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  orientation: z.enum(["upright", "reversed"]),
});

export const tarotVarsSchema = z.object({
  cards: z.array(tarotCardSchema).min(1),
  question: z.string().optional(),
});

export const chatVarsSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  user_message: z.string().min(1),
  conversation_history: z.string().optional(),
});

// --- Inferred Types ---

export type HoroscopeVars = z.infer<typeof horoscopeVarsSchema>;
export type WeeklyHoroscopeVars = z.infer<typeof weeklyHoroscopeVarsSchema>;
export type PersonalReadingVars = z.infer<typeof personalReadingVarsSchema>;
export type TarotVars = z.infer<typeof tarotVarsSchema>;
export type ChatVars = z.infer<typeof chatVarsSchema>;

// --- Schema Lookup ---

const schemaMap = {
  horoscope: horoscopeVarsSchema,
  "weekly-horoscope": weeklyHoroscopeVarsSchema,
  "personal-reading": personalReadingVarsSchema,
  tarot: tarotVarsSchema,
  chat: chatVarsSchema,
} as const satisfies Record<PromptType, z.ZodType>;

export function getPromptVarsSchema(type: PromptType): z.ZodType {
  return schemaMap[type];
}
