import { z } from "zod";

// --- Constants ---

export const SUN_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type SunSign = (typeof SUN_SIGNS)[number];

export const PLAN_TYPES = ["free", "pro"] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

export const SUBSCRIPTION_STATUSES = [
  "none",
  "active",
  "trialing",
  "past_due",
  "canceled",
  "unpaid",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const READING_TYPES = ["personal", "tarot", "compatibility", "chat"] as const;
export type ReadingType = (typeof READING_TYPES)[number];

export const SESSION_TYPES = ["chat", "tarot", "personal"] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const MESSAGE_ROLES = ["user", "assistant"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

export const CONSENT_TYPES = [
  "terms_and_privacy",
  "eu_art16m",
  "entertainment_disclaimer",
] as const;
export type ConsentType = (typeof CONSENT_TYPES)[number];

export const SHARE_CHANNELS = [
  "pinterest",
  "x",
  "facebook",
  "whatsapp",
  "download",
] as const;
export type ShareChannel = (typeof SHARE_CHANNELS)[number];

export const SHARE_READING_TYPES = ["horoscope", "reading", "tarot", "weekly"] as const;
export type ShareReadingType = (typeof SHARE_READING_TYPES)[number];

// --- Zod Schemas (Insert) ---

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const profileInsertSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  display_name: z.string().optional(),
  birth_date: dateStringSchema,
  birth_time: z.string().optional(),
  birth_place: z.string().optional(),
  sun_sign: z.enum(SUN_SIGNS),
  plan: z.enum(PLAN_TYPES).default("free"),
});

export const readingInsertSchema = z.object({
  user_id: z.string().min(1),
  type: z.enum(READING_TYPES),
  content: z.string().min(1),
  prompt_version: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const sessionInsertSchema = z.object({
  user_id: z.string().min(1),
  type: z.enum(SESSION_TYPES),
  turn_count: z.number().int().min(0).default(0),
  turn_limit: z.number().int().min(1),
});

export const sessionMessageInsertSchema = z.object({
  session_id: z.string().min(1),
  role: z.enum(MESSAGE_ROLES),
  content: z.string().min(1),
  token_count: z.number().int().min(0).optional(),
});

export const dailyHoroscopeInsertSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  date: dateStringSchema,
  content: z.string().min(1),
  prompt_version: z.string().min(1),
});

export const weeklyHoroscopeInsertSchema = z.object({
  sign: z.enum(SUN_SIGNS),
  week_start: dateStringSchema,
  content: z.string().min(1),
  prompt_version: z.string().min(1),
});

export const consentRecordInsertSchema = z.object({
  user_id: z.string().min(1),
  consent_type: z.enum(CONSENT_TYPES),
  ip_address: z.string().min(1),
  country_code: z.string().length(2).optional(),
});

export const shareEventInsertSchema = z.object({
  user_id: z.string().min(1).optional(),
  channel: z.enum(SHARE_CHANNELS),
  reading_type: z.enum(SHARE_READING_TYPES),
});

// --- Row Types (full DB rows with timestamps) ---

export type ProfileRow = z.infer<typeof profileInsertSchema> & {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_period_end: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ReadingRow = z.infer<typeof readingInsertSchema> & {
  id: string;
  created_at: string;
};

export type SessionRow = z.infer<typeof sessionInsertSchema> & {
  id: string;
  created_at: string;
  ended_at: string | null;
};

export type SessionMessageRow = z.infer<typeof sessionMessageInsertSchema> & {
  id: string;
  created_at: string;
};

export type DailyHoroscopeRow = z.infer<typeof dailyHoroscopeInsertSchema> & {
  id: string;
  created_at: string;
};

export type WeeklyHoroscopeRow = z.infer<typeof weeklyHoroscopeInsertSchema> & {
  id: string;
  created_at: string;
};

export type ConsentRecordRow = z.infer<typeof consentRecordInsertSchema> & {
  id: string;
  consented_at: string;
};

export type ShareEventRow = z.infer<typeof shareEventInsertSchema> & {
  id: string;
  created_at: string;
};
