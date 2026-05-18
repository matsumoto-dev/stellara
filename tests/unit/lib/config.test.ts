import { beforeEach, describe, expect, it, vi } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe("getClientEnv", () => {
    it("should not throw on module import even without env vars", async () => {
      const mod = await import("@/lib/config");
      expect(mod.getClientEnv).toBeDefined();
    });

    it("should parse valid client environment variables", async () => {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

      const { getClientEnv } = await import("@/lib/config");
      const env = getClientEnv();
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://test.supabase.co");
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("test-anon-key");
    });

    it("should throw on missing NEXT_PUBLIC_SUPABASE_URL when called", async () => {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

      const { getClientEnv } = await import("@/lib/config");
      expect(() => getClientEnv()).toThrow();
    });

    it("should throw on invalid URL format when called", async () => {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not-a-url");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

      const { getClientEnv } = await import("@/lib/config");
      expect(() => getClientEnv()).toThrow();
    });

    it("should cache the result after first successful call", async () => {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

      const { getClientEnv } = await import("@/lib/config");
      const first = getClientEnv();
      const second = getClientEnv();
      expect(first).toBe(second);
    });
  });

  describe("getServerEnv", () => {
    it("should not throw on module import even without env vars", async () => {
      const mod = await import("@/lib/config");
      expect(mod.getServerEnv).toBeDefined();
    });

    it("should parse valid server environment variables", async () => {
      vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc");
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_abc");

      const { getServerEnv } = await import("@/lib/config");
      const env = getServerEnv();
      expect(env).not.toBeNull();
      expect(env?.SUPABASE_SERVICE_ROLE_KEY).toBe("test-service-key");
      expect(env?.ANTHROPIC_API_KEY).toBe("sk-ant-test-key");
      expect(env?.STRIPE_SECRET_KEY).toBe("sk_test_abc");
      expect(env?.STRIPE_WEBHOOK_SECRET).toBe("whsec_abc");
    });

    it("should return null when server env vars are missing", async () => {
      vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
      vi.stubEnv("ANTHROPIC_API_KEY", "");

      const { getServerEnv } = await import("@/lib/config");
      const env = getServerEnv();
      expect(env).toBeNull();
    });

    it("should cache the result after first call", async () => {
      vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-key");
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc");
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_abc");

      const { getServerEnv } = await import("@/lib/config");
      const first = getServerEnv();
      const second = getServerEnv();
      expect(first).toBe(second);
    });
  });

  describe("getStripePublicEnv", () => {
    it("should parse valid stripe public key", async () => {
      vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_abc");

      const { getStripePublicEnv } = await import("@/lib/config");
      const env = getStripePublicEnv();
      expect(env).not.toBeNull();
      expect(env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).toBe("pk_test_abc");
    });

    it("should return null when stripe public key is missing", async () => {
      const { getStripePublicEnv } = await import("@/lib/config");
      const env = getStripePublicEnv();
      expect(env).toBeNull();
    });
  });
});
