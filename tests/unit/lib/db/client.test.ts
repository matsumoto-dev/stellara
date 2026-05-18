import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({ supabaseUrl: "mocked" })),
}));

describe("lib/db/client", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
  });

  it("should export createClient function", async () => {
    const mod = await import("@/lib/db/client");
    expect(mod.createClient).toBeDefined();
    expect(typeof mod.createClient).toBe("function");
  });

  it("should return a Supabase client instance", async () => {
    const mod = await import("@/lib/db/client");
    const client = mod.createClient();
    expect(client).toBeDefined();
  });

  it("should call createBrowserClient with correct params", async () => {
    const { createBrowserClient } = await import("@supabase/ssr");
    const mod = await import("@/lib/db/client");
    mod.createClient();
    expect(createBrowserClient).toHaveBeenCalledWith("https://test.supabase.co", "test-anon-key");
  });
});
