// ---------------------------------------------------------------------------
// Rate-limit helpers — DB-backed limits per action
//
// Supports three counting windows:
//   daily    — resets at UTC midnight each day
//   monthly  — resets at UTC month start
//   lifetime — counts all usage ever (for one-time free features)
//
// Dependency-injected via RateLimitClient so tests never touch Supabase.
// ---------------------------------------------------------------------------

export interface RateLimitClient {
  from(table: string): {
    select(
      columns?: string,
      options?: unknown,
    ): {
      eq(
        column: string,
        value: string,
      ): {
        gte(column: string, value: string): Promise<{ count: number | null; error: unknown }>;
      };
    };
  };
}

/** Counting window for the rate limit check. */
export type RateLimitWindow = "daily" | "monthly" | "lifetime";

export interface RateLimitConfig {
  readonly userId: string;
  readonly action: string; // "horoscope" | "personal" | "tarot" | "chat" | ...
  readonly plan: string; // "free" | "pro"
  /** Defaults to "daily" when not provided. */
  readonly window?: RateLimitWindow;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly limit: number;
  /** ISO date string — end of the current counting window */
  readonly resetAt: string;
}

// ---------------------------------------------------------------------------
// Limit tables
// ---------------------------------------------------------------------------

/** Free-plan limits per counting window. */
const FREE_DAILY_LIMITS: Record<string, number> = {
  horoscope: 1,
  tarot: 1,
};

/** Free personal reading: 1 lifetime (onboarding only). */
const FREE_LIFETIME_LIMITS: Record<string, number> = {
  personal: 1,
};

/** Pro monthly limits (all other Pro features are unlimited). */
const PRO_MONTHLY_LIMITS: Record<string, number> = {
  chat: 20,
};

const DEFAULT_FREE_LIMIT = 1;

// ---------------------------------------------------------------------------
// Window helpers
// ---------------------------------------------------------------------------

/** End of current UTC day — 23:59:59.999Z */
function endOfUtcDay(): string {
  const now = new Date();
  const eod = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );
  return eod.toISOString();
}

/** Start of current UTC day — 00:00:00.000Z */
function startOfUtcDay(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

/** Start of current UTC month — YYYY-MM-01T00:00:00.000Z */
function startOfUtcMonth(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

/** End of current UTC month — last millisecond of the month */
function endOfUtcMonth(): string {
  const now = new Date();
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return new Date(nextMonthStart.getTime() - 1).toISOString();
}

/**
 * Epoch start used for "lifetime" queries.
 * All readings are in Supabase so this covers the full history.
 */
const EPOCH_START = "2020-01-01T00:00:00.000Z";

/** Returns the start date and resetAt for a given window. */
function windowBounds(window: RateLimitWindow): { startDate: string; resetAt: string } {
  switch (window) {
    case "daily":
      return { startDate: startOfUtcDay(), resetAt: endOfUtcDay() };
    case "monthly":
      return { startDate: startOfUtcMonth(), resetAt: endOfUtcMonth() };
    case "lifetime":
      return { startDate: EPOCH_START, resetAt: endOfUtcDay() };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether a user is within their rate limit for a given action.
 *
 * Plan behaviour:
 *   Pro — unlimited by default; monthly limit applies to "chat" (20/month).
 *   Free — daily limits for horoscope/tarot; lifetime limit for personal.
 *
 * The caller is responsible for setting the correct `window` to match the
 * feature semantics (e.g. window:"lifetime" for free personal reading).
 */
export async function checkRateLimit(
  client: RateLimitClient,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const window = config.window ?? "daily";
  const { startDate, resetAt } = windowBounds(window);

  // ── Pro plan ──────────────────────────────────────────────────────────────
  if (config.plan === "pro") {
    const proLimit = PRO_MONTHLY_LIMITS[config.action];
    if (proLimit === undefined) {
      // Truly unlimited for this action
      return {
        allowed: true,
        remaining: Number.POSITIVE_INFINITY,
        limit: Number.POSITIVE_INFINITY,
        resetAt,
      };
    }

    // Pro with a monthly limit (e.g. chat: 20/month) — fall through to count
    const { count, error } = await client
      .from("readings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", config.userId)
      .gte("created_at", startDate);

    if (error) {
      throw new Error(`Failed to check rate limit: ${String(error)}`);
    }

    const used = count ?? 0;
    const remaining = Math.max(0, proLimit - used);
    return { allowed: used < proLimit, remaining, limit: proLimit, resetAt };
  }

  // ── Free plan ─────────────────────────────────────────────────────────────

  // Determine the limit: lifetime overrides daily
  const lifetimeLimit = FREE_LIFETIME_LIMITS[config.action];
  const limit =
    lifetimeLimit !== undefined
      ? lifetimeLimit
      : (FREE_DAILY_LIMITS[config.action] ?? DEFAULT_FREE_LIMIT);

  const { count, error } = await client
    .from("readings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", config.userId)
    .gte("created_at", startDate);

  if (error) {
    throw new Error(`Failed to check rate limit: ${String(error)}`);
  }

  const used = count ?? 0;
  const remaining = Math.max(0, limit - used);
  return { allowed: used < limit, remaining, limit, resetAt };
}
