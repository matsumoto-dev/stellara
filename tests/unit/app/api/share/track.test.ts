import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Supabase mock ────────────────────────────────────────────────────────────

const mockInsert = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/db/server", () => ({
  createClient: () => ({ from: mockFrom }),
}));

// ── Auth mock ────────────────────────────────────────────────────────────────

const mockGetCurrentUser = vi.fn();

vi.mock("@/lib/auth/helpers", () => ({
  getCurrentUser: (...args: unknown[]) => mockGetCurrentUser(...args),
}));

// ── Config mock ──────────────────────────────────────────────────────────────

vi.mock("@/lib/config", () => ({
  getClientEnv: () => ({
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

async function callPost(body: unknown) {
  const { POST } = await import("@/app/api/share/track/route");
  const request = new Request("http://localhost/api/share/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return POST(request);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/share/track", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Default: unauthenticated
    mockGetCurrentUser.mockResolvedValue(null);

    // Default: successful insert
    mockInsert.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it("returns 201 on success (unauthenticated)", async () => {
    const res = await callPost({ channel: "x", reading_type: "horoscope" });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it("returns 201 on success (authenticated)", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-abc" });

    const res = await callPost({ channel: "pinterest", reading_type: "tarot" });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it("inserts event with user_id when authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-xyz" });

    await callPost({ channel: "facebook", reading_type: "reading" });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-xyz", channel: "facebook", reading_type: "reading" }),
    );
  });

  it("inserts event without user_id when unauthenticated", async () => {
    await callPost({ channel: "download", reading_type: "weekly" });

    const insertArg = mockInsert.mock.calls[0][0];
    expect(insertArg.user_id).toBeUndefined();
    expect(insertArg.channel).toBe("download");
    expect(insertArg.reading_type).toBe("weekly");
  });

  it("returns 400 for invalid channel", async () => {
    const res = await callPost({ channel: "telegram", reading_type: "horoscope" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid request body");
  });

  it("returns 400 for missing reading_type", async () => {
    const res = await callPost({ channel: "x" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 400 for missing channel", async () => {
    const res = await callPost({ reading_type: "horoscope" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 400 for invalid JSON body", async () => {
    const { POST } = await import("@/app/api/share/track/route");
    const request = new Request("http://localhost/api/share/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(request);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid JSON");
  });

  it("returns 500 when database insert fails", async () => {
    mockInsert.mockResolvedValue({ error: { message: "DB error" } });

    const res = await callPost({ channel: "whatsapp", reading_type: "reading" });
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
  });

  it("accepts all valid channels", async () => {
    const channels = ["pinterest", "x", "facebook", "whatsapp", "download"] as const;

    for (const channel of channels) {
      vi.resetModules();
      vi.clearAllMocks();
      mockGetCurrentUser.mockResolvedValue(null);
      mockInsert.mockResolvedValue({ error: null });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const res = await callPost({ channel, reading_type: "horoscope" });
      expect(res.status).toBe(201);
    }
  });

  it("returns 400 when reading_type is empty string", async () => {
    const res = await callPost({ channel: "x", reading_type: "" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 400 for invalid reading_type", async () => {
    const res = await callPost({ channel: "x", reading_type: "invalid_type" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid request body");
  });

  it("accepts all valid reading types", async () => {
    const readingTypes = ["horoscope", "reading", "tarot", "weekly"] as const;

    for (const reading_type of readingTypes) {
      vi.resetModules();
      vi.clearAllMocks();
      mockGetCurrentUser.mockResolvedValue(null);
      mockInsert.mockResolvedValue({ error: null });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const res = await callPost({ channel: "x", reading_type });
      expect(res.status).toBe(201);
    }
  });
});
