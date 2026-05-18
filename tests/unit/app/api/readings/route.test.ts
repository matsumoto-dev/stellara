import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Supabase mock ────────────────────────────────────────────────────────────

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockFrom = vi.fn();

function buildChain(overrides: Record<string, unknown> = {}) {
  const chain = {
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
    range: mockRange,
    ...overrides,
  };
  mockSelect.mockReturnValue(chain);
  mockEq.mockReturnValue(chain);
  mockSingle.mockReturnValue({ data: null, error: null });
  mockOrder.mockReturnValue(chain);
  mockRange.mockReturnValue({ data: [], error: null, count: 0 });
  mockFrom.mockReturnValue(chain);
  return chain;
}

vi.mock("@/lib/db/server", () => ({
  createClient: () => ({ from: mockFrom }),
}));

// ── Auth mock ────────────────────────────────────────────────────────────────

const mockRequireAuth = vi.fn();

vi.mock("@/lib/auth/helpers", () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  AuthError: class AuthError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

// ── Config mock ──────────────────────────────────────────────────────────────

vi.mock("@/lib/config", () => ({
  getClientEnv: () => ({
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

async function callGet(query = "") {
  const { GET } = await import("@/app/api/readings/route");
  const url = `http://localhost/api/readings${query}`;
  const request = new Request(url, { method: "GET" });
  return GET(request);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/readings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockRequireAuth.mockResolvedValue({ id: "user-123" });
  });

  it("returns 401 when not authenticated", async () => {
    const { AuthError } = await import("@/lib/auth/helpers");
    mockRequireAuth.mockRejectedValue(new AuthError("Unauthorized", 401));

    const res = await callGet();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 402 when user is on free plan", async () => {
    buildChain();
    // Profile returns free plan
    mockSingle.mockReturnValue({ data: { plan: "free" }, error: null });

    const res = await callGet();
    expect(res.status).toBe(402);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.upgradeRequired).toBe(true);
  });

  it("returns 200 with readings list for pro user", async () => {
    const chain = buildChain();
    // Profile call: single() → pro plan
    mockSingle.mockReturnValueOnce({ data: { plan: "pro" }, error: null });
    // Readings call: range() → list
    const mockReadings = [
      { id: "r1", type: "personal", content: "Stars align...", prompt_version: "v1", metadata: {}, created_at: "2026-04-03T00:00:00Z" },
      { id: "r2", type: "tarot", content: "The cards reveal...", prompt_version: "v1", metadata: {}, created_at: "2026-04-02T00:00:00Z" },
    ];
    mockRange.mockReturnValueOnce({ data: mockReadings, error: null, count: 2 });
    void chain;

    const res = await callGet();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.readings).toHaveLength(2);
    expect(json.data.total).toBe(2);
    expect(json.data.limit).toBe(20);
    expect(json.data.offset).toBe(0);
  });

  it("respects limit and offset query params", async () => {
    buildChain();
    mockSingle.mockReturnValueOnce({ data: { plan: "pro" }, error: null });
    mockRange.mockReturnValueOnce({ data: [], error: null, count: 5 });

    const res = await callGet("?limit=5&offset=5");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.limit).toBe(5);
    expect(json.data.offset).toBe(5);
  });

  it("returns 400 for invalid query params", async () => {
    buildChain();
    mockSingle.mockReturnValueOnce({ data: { plan: "pro" }, error: null });

    const res = await callGet("?limit=999");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 500 when DB query fails", async () => {
    buildChain();
    mockSingle.mockReturnValueOnce({ data: { plan: "pro" }, error: null });
    mockRange.mockReturnValueOnce({ data: null, error: new Error("DB error"), count: null });

    const res = await callGet();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns empty array when no readings exist", async () => {
    buildChain();
    mockSingle.mockReturnValueOnce({ data: { plan: "pro" }, error: null });
    mockRange.mockReturnValueOnce({ data: [], error: null, count: 0 });

    const res = await callGet();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.readings).toHaveLength(0);
    expect(json.data.total).toBe(0);
  });
});
