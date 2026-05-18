import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Stripe client
const mockCustomersCreate = vi.fn();
const mockCheckoutSessionsCreate = vi.fn();
const mockBillingPortalSessionsCreate = vi.fn();

vi.mock("@/lib/stripe/client", () => ({
  getStripe: () => ({
    customers: { create: mockCustomersCreate },
    checkout: { sessions: { create: mockCheckoutSessionsCreate } },
    billingPortal: { sessions: { create: mockBillingPortalSessionsCreate } },
  }),
}));

// Mock admin client
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/db/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: (...args: unknown[]) => {
        mockSelect(...args);
        return {
          eq: (...eqArgs: unknown[]) => {
            mockEq(...eqArgs);
            return { single: () => mockSingle() };
          },
        };
      },
      update: (...args: unknown[]) => {
        mockUpdate(...args);
        return {
          eq: () => ({ data: null, error: null }),
        };
      },
    }),
  }),
}));

describe("stripe helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrCreateStripeCustomer", () => {
    it("should return existing customer ID from DB", async () => {
      mockSingle.mockResolvedValue({
        data: { stripe_customer_id: "cus_existing" },
        error: null,
      });

      const { getOrCreateStripeCustomer } = await import("@/lib/stripe/helpers");
      const result = await getOrCreateStripeCustomer("user-1", "test@example.com");
      expect(result).toBe("cus_existing");
      expect(mockCustomersCreate).not.toHaveBeenCalled();
    });

    it("should create new customer when none exists", async () => {
      mockSingle.mockResolvedValue({
        data: { stripe_customer_id: null },
        error: null,
      });
      mockCustomersCreate.mockResolvedValue({ id: "cus_new" });

      const { getOrCreateStripeCustomer } = await import("@/lib/stripe/helpers");
      const result = await getOrCreateStripeCustomer("user-1", "test@example.com");
      expect(result).toBe("cus_new");
      expect(mockCustomersCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        metadata: { supabase_user_id: "user-1" },
      });
    });
  });

  describe("createPortalSession", () => {
    it("should create a portal session and return URL", async () => {
      mockBillingPortalSessionsCreate.mockResolvedValue({
        url: "https://billing.stripe.com/portal/session_123",
      });

      const { createPortalSession } = await import("@/lib/stripe/helpers");
      const url = await createPortalSession("cus_123", "https://stellara.chat/settings");
      expect(url).toBe("https://billing.stripe.com/portal/session_123");
      expect(mockBillingPortalSessionsCreate).toHaveBeenCalledWith({
        customer: "cus_123",
        return_url: "https://stellara.chat/settings",
      });
    });
  });

  describe("syncSubscriptionStatus", () => {
    it("should update profile with active subscription", async () => {
      mockSingle.mockResolvedValue({
        data: { id: "user-1" },
        error: null,
      });

      const { syncSubscriptionStatus } = await import("@/lib/stripe/helpers");
      await syncSubscriptionStatus({
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        items: {
          data: [{ current_period_end: 1700000000 }],
        },
      } as never);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "pro",
        subscription_status: "active",
        stripe_subscription_id: "sub_123",
        subscription_period_end: expect.any(String),
      });
    });

    it("should set plan to free for canceled subscription", async () => {
      mockSingle.mockResolvedValue({
        data: { id: "user-1" },
        error: null,
      });

      const { syncSubscriptionStatus } = await import("@/lib/stripe/helpers");
      await syncSubscriptionStatus({
        id: "sub_123",
        customer: "cus_123",
        status: "canceled",
        items: { data: [{ current_period_end: 1700000000 }] },
      } as never);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: "free",
          subscription_status: "canceled",
        }),
      );
    });

    it("should do nothing if profile not found", async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const { syncSubscriptionStatus } = await import("@/lib/stripe/helpers");
      await syncSubscriptionStatus({
        id: "sub_123",
        customer: "cus_unknown",
        status: "active",
        items: { data: [] },
      } as never);

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("handleSubscriptionDeleted", () => {
    it("should reset user to free plan", async () => {
      mockSingle.mockResolvedValue({
        data: { id: "user-1" },
        error: null,
      });

      const { handleSubscriptionDeleted } = await import("@/lib/stripe/helpers");
      await handleSubscriptionDeleted({
        id: "sub_123",
        customer: "cus_123",
      } as never);

      expect(mockUpdate).toHaveBeenCalledWith({
        plan: "free",
        subscription_status: "canceled",
        stripe_subscription_id: null,
        subscription_period_end: null,
      });
    });
  });
});
