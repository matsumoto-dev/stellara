import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCookieStore = {
  getAll: vi.fn(() => []),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ supabaseUrl: "mocked-server" })),
}));

describe("lib/db/server", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
  });

  it("should export createClient function", async () => {
    const mod = await import("@/lib/db/server");
    expect(mod.createClient).toBeDefined();
    expect(typeof mod.createClient).toBe("function");
  });

  it("should return a Supabase server client", async () => {
    const mod = await import("@/lib/db/server");
    const client = await mod.createClient();
    expect(client).toBeDefined();
  });

  it("should call createServerClient with correct params", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    const mod = await import("@/lib/db/server");
    await mod.createClient();
    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.any(Object),
      }),
    );
  });
});
