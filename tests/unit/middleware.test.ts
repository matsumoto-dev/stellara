import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn(() => Promise.resolve({ data: { user: null } }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

describe("middleware", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    mockGetUser.mockClear();
  });

  it("should pass through when env vars are missing", async () => {
    const { middleware } = await import("@/middleware");

    const request = createMockRequest("/dashboard");
    const response = await middleware(request);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { createServerClient } = await import("@supabase/ssr");
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("should create Supabase client and refresh session when env vars are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

    const { middleware } = await import("@/middleware");
    const { createServerClient } = await import("@supabase/ssr");

    const request = createMockRequest("/dashboard");
    await middleware(request);

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.any(Object),
      }),
    );
    expect(mockGetUser).toHaveBeenCalledOnce();
  });

  it("should export matcher config that excludes static assets", async () => {
    const { config } = await import("@/middleware");

    expect(config.matcher).toBeDefined();
    expect(config.matcher[0]).toContain("_next/static");
    expect(config.matcher[0]).toContain("favicon.ico");
  });

  it("should allow unauthenticated access to /api/og/* and /api/share/track (SNS crawlers)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const publicApiPaths = [
      "/api/og/reading/horoscope",
      "/api/og/reading/tarot",
      "/api/og/reading/personal",
      "/api/share/track",
    ];

    for (const path of publicApiPaths) {
      vi.resetModules();
      const { middleware: mw } = await import("@/middleware");
      const request = createMockRequest(path);
      const response = await mw(request);
      expect(response.status, `Expected ${path} to be public (200), not redirect`).toBe(200);
    }
  });

  it("should allow unauthenticated access to SEO pages (/faq, /compatibility, /tarot/[card])", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { middleware } = await import("@/middleware");

    // /tarot (no subpath) is the protected app page — only /tarot/[card] is the public SEO page
    const seoPaths = [
      "/faq",
      "/compatibility",
      "/compatibility/aries-taurus",
      "/tarot/the-fool",
      "/tarot/the-magician",
    ];

    for (const path of seoPaths) {
      vi.resetModules();
      const { middleware: mw } = await import("@/middleware");
      const request = createMockRequest(path);
      const response = await mw(request);
      expect(response.status, `Expected ${path} to be public (200), not redirect`).toBe(200);
    }
  });
});

function createMockRequest(path: string) {
  const url = new URL(path, "http://localhost:3000");
  return {
    cookies: {
      getAll: () => [],
    },
    nextUrl: url,
    url: url.toString(),
  } as unknown as import("next/server").NextRequest;
}
