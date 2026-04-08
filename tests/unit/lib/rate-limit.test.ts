import { describe, expect, it } from "vitest";
import { checkRateLimit, type RateLimitClient, type RateLimitConfig } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

/**
 * Builds a minimal RateLimitClient mock.
 *
 * The real Supabase chain for a count query looks like:
 *   client.from(table).select(columns, { count: 'exact' }).eq(...).gte(...)
 * and resolves to { count: number | null, error: unknown }.
 *
 * We collapse the terminal `.gte()` call to the promise so the mock stays flat.
 */
function createMockClient(options?: { count?: number | null; error?: unknown }): RateLimitClient {
  const count = options?.count ?? 0;
  const error = options?.error ?? null;

  return {
    from: (_table: string) => ({
      select: (_columns?: string, _opts?: unknown) => ({
        eq: (_col: string, _val: string) => ({
          gte: (_col2: string, _val2: string) => Promise.resolve({ count, error }),
        }),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// Helper: build a config object
// ---------------------------------------------------------------------------
function cfg(overrides: Partial<RateLimitConfig> = {}): RateLimitConfig {
  return {
    userId: "user-1",
    action: "horoscope",
    plan: "free",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Pro plan — unlimited features
// ---------------------------------------------------------------------------

describe("checkRateLimit — pro plan, unlimited features", () => {
  it("always returns allowed:true regardless of reading count", async () => {
    const client = createMockClient({ count: 999 });
    const result = await checkRateLimit(client, cfg({ plan: "pro" }));

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(Number.POSITIVE_INFINITY);
    expect(result.limit).toBe(Number.POSITIVE_INFINITY);
  });

  it("does not call the database for pro unlimited features", async () => {
    let dbCalled = false;
    const client: RateLimitClient = {
      from: (_table: string) => {
        dbCalled = true;
        return {
          select: () => ({
            eq: () => ({
              gte: () => Promise.resolve({ count: 0, error: null }),
            }),
          }),
        };
      },
    };

    await checkRateLimit(client, cfg({ plan: "pro" }));
    expect(dbCalled).toBe(false);
  });

  it("returns a valid resetAt ISO string for pro unlimited users", async () => {
    const client = createMockClient();
    const result = await checkRateLimit(client, cfg({ plan: "pro" }));

    expect(() => new Date(result.resetAt)).not.toThrow();
    expect(new Date(result.resetAt).toISOString()).toBe(result.resetAt);
  });
});

// ---------------------------------------------------------------------------
// Pro plan — monthly chat limit (20/month)
// ---------------------------------------------------------------------------

describe("checkRateLimit — pro plan, chat (monthly limit: 20)", () => {
  const proChatCfg = (count?: number, dbCount?: number | null) =>
    ({
      client: createMockClient({ count: dbCount ?? count }),
      config: cfg({ plan: "pro", action: "chat", window: "monthly" }),
    }) as const;

  it("allows when 0 chats used this month", async () => {
    const { client, config } = proChatCfg(0);
    const result = await checkRateLimit(client, config);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(20);
    expect(result.limit).toBe(20);
  });

  it("allows when 19 chats used (1 remaining)", async () => {
    const { client, config } = proChatCfg(19);
    const result = await checkRateLimit(client, config);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it("blocks when 20 chats used (at monthly limit)", async () => {
    const { client, config } = proChatCfg(20);
    const result = await checkRateLimit(client, config);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(20);
  });

  it("blocks when count exceeds limit (defensive)", async () => {
    const { client, config } = proChatCfg(25);
    const result = await checkRateLimit(client, config);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("calls the database for pro users with monthly limits", async () => {
    let dbCalled = false;
    const client: RateLimitClient = {
      from: (_table: string) => {
        dbCalled = true;
        return {
          select: () => ({
            eq: () => ({
              gte: () => Promise.resolve({ count: 5, error: null }),
            }),
          }),
        };
      },
    };

    await checkRateLimit(client, cfg({ plan: "pro", action: "chat", window: "monthly" }));
    expect(dbCalled).toBe(true);
  });

  it("resetAt is end of current month for monthly window", async () => {
    const client = createMockClient({ count: 0 });
    const result = await checkRateLimit(
      client,
      cfg({ plan: "pro", action: "chat", window: "monthly" }),
    );
    const resetAt = new Date(result.resetAt);
    const now = new Date();

    // Must be in same month or next month boundary
    expect(resetAt.getTime()).toBeGreaterThan(now.getTime());
    // Must be a valid ISO string
    expect(new Date(result.resetAt).toISOString()).toBe(result.resetAt);
  });
});

// ---------------------------------------------------------------------------
// Free plan — horoscope (daily limit: 1)
// ---------------------------------------------------------------------------

describe("checkRateLimit — free plan, horoscope (limit: 1/day)", () => {
  it("allows when 0 readings today", async () => {
    const client = createMockClient({ count: 0 });
    const result = await checkRateLimit(client, cfg({ action: "horoscope" }));

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
    expect(result.limit).toBe(1);
  });

  it("blocks when 1 reading already used (at limit)", async () => {
    const client = createMockClient({ count: 1 });
    const result = await checkRateLimit(client, cfg({ action: "horoscope" }));

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(1);
  });

  it("blocks when count exceeds limit (defensive: count > limit)", async () => {
    const client = createMockClient({ count: 5 });
    const result = await checkRateLimit(client, cfg({ action: "horoscope" }));

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Free plan — personal reading (lifetime limit: 1)
// ---------------------------------------------------------------------------

describe("checkRateLimit — free plan, personal (lifetime limit: 1)", () => {
  it("allows when 0 personal readings ever", async () => {
    const client = createMockClient({ count: 0 });
    const result = await checkRateLimit(
      client,
      cfg({ action: "personal", window: "lifetime" }),
    );

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
    expect(result.limit).toBe(1);
  });

  it("blocks when 1 personal reading exists (lifetime limit reached)", async () => {
    const client = createMockClient({ count: 1 });
    const result = await checkRateLimit(
      client,
      cfg({ action: "personal", window: "lifetime" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("blocks when multiple personal readings exist", async () => {
    const client = createMockClient({ count: 3 });
    const result = await checkRateLimit(
      client,
      cfg({ action: "personal", window: "lifetime" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Free plan — tarot (daily limit: 1)
// ---------------------------------------------------------------------------

describe("checkRateLimit — free plan, tarot (limit: 1/day)", () => {
  it("allows when 0 readings today", async () => {
    const client = createMockClient({ count: 0 });
    const result = await checkRateLimit(client, cfg({ action: "tarot" }));

    expect(result.allowed).toBe(true);
  });

  it("blocks when limit reached", async () => {
    const client = createMockClient({ count: 1 });
    const result = await checkRateLimit(client, cfg({ action: "tarot" }));

    expect(result.allowed).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Unknown action defaults to limit 1
// ---------------------------------------------------------------------------

describe("checkRateLimit — unknown action defaults to limit 1", () => {
  it("allows when 0 uses today for an unknown action", async () => {
    const client = createMockClient({ count: 0 });
    const result = await checkRateLimit(client, cfg({ action: "unknown_action" }));

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(1);
    expect(result.remaining).toBe(1);
  });

  it("blocks when 1 use already recorded for an unknown action", async () => {
    const client = createMockClient({ count: 1 });
    const result = await checkRateLimit(client, cfg({ action: "unknown_action" }));

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// remaining calculation
// ---------------------------------------------------------------------------

describe("checkRateLimit — remaining calculation", () => {
  it("remaining is clamped to 0 when count exceeds limit", async () => {
    const client = createMockClient({ count: 10 });
    const result = await checkRateLimit(client, cfg({ action: "horoscope" }));

    expect(result.remaining).toBe(0);
  });

  it("remaining equals limit - count for pro monthly chat", async () => {
    const client = createMockClient({ count: 15 });
    const result = await checkRateLimit(
      client,
      cfg({ plan: "pro", action: "chat", window: "monthly" }),
    );

    // limit 20, count 15 → remaining 5
    expect(result.remaining).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// resetAt
// ---------------------------------------------------------------------------

describe("checkRateLimit — resetAt (daily window)", () => {
  it("resetAt is the end of the current UTC day (23:59:59.999Z)", async () => {
    const client = createMockClient({ count: 0 });
    const before = new Date();
    const result = await checkRateLimit(client, cfg());
    const resetAt = new Date(result.resetAt);

    expect(resetAt.getUTCFullYear()).toBe(before.getUTCFullYear());
    expect(resetAt.getUTCMonth()).toBe(before.getUTCMonth());
    expect(resetAt.getUTCDate()).toBe(before.getUTCDate());

    expect(resetAt.getUTCHours()).toBe(23);
    expect(resetAt.getUTCMinutes()).toBe(59);
    expect(resetAt.getUTCSeconds()).toBe(59);
    expect(resetAt.getUTCMilliseconds()).toBe(999);
  });
});

// ---------------------------------------------------------------------------
// DB error propagation
// ---------------------------------------------------------------------------

describe("checkRateLimit — DB error propagation", () => {
  it("throws when the Supabase client returns an error (free plan)", async () => {
    const client = createMockClient({
      count: null,
      error: { message: "DB connection failed" },
    });

    await expect(checkRateLimit(client, cfg({ plan: "free" }))).rejects.toThrow(
      "Failed to check rate limit",
    );
  });

  it("throws when the Supabase client returns an error (pro monthly)", async () => {
    const client = createMockClient({
      count: null,
      error: { message: "DB connection failed" },
    });

    await expect(
      checkRateLimit(client, cfg({ plan: "pro", action: "chat", window: "monthly" })),
    ).rejects.toThrow("Failed to check rate limit");
  });
});
