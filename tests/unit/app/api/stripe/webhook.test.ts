import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
const mockConstructEvent = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();

vi.mock("@/lib/stripe/client", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mockConstructEvent },
    subscriptions: { retrieve: mockSubscriptionsRetrieve },
  }),
}));

const mockSyncSubscriptionStatus = vi.fn();
const mockHandleSubscriptionDeleted = vi.fn();

vi.mock("@/lib/stripe/helpers", () => ({
  syncSubscriptionStatus: (...args: unknown[]) => mockSyncSubscriptionStatus(...args),
  handleSubscriptionDeleted: (...args: unknown[]) => mockHandleSubscriptionDeleted(...args),
}));

vi.mock("@/lib/config", () => ({
  getServerEnv: () => ({
    STRIPE_SECRET_KEY: "sk_test_abc",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    SUPABASE_SERVICE_ROLE_KEY: "test-key",
    ANTHROPIC_API_KEY: "sk-ant-test",
  }),
}));

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function callWebhook(body: string, signature: string | null) {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const headers = new Headers();
    if (signature) headers.set("stripe-signature", signature);
    const request = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      body,
      headers,
    });
    return POST(request);
  }

  it("should return 400 when stripe-signature is missing", async () => {
    const res = await callWebhook("{}", null);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Missing stripe-signature header");
  });

  it("should return 400 when signature is invalid", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await callWebhook("{}", "sig_invalid");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid signature");
  });

  it("should return 200 for irrelevant event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    });

    const res = await callWebhook("{}", "sig_valid");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  it("should sync subscription on customer.subscription.updated", async () => {
    const mockSubscription = { id: "sub_123", customer: "cus_123", status: "active" };
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: mockSubscription },
    });
    mockSyncSubscriptionStatus.mockResolvedValue(undefined);

    const res = await callWebhook("{}", "sig_valid");
    expect(res.status).toBe(200);
    expect(mockSyncSubscriptionStatus).toHaveBeenCalledWith(mockSubscription);
  });

  it("should handle subscription deletion", async () => {
    const mockSubscription = { id: "sub_123", customer: "cus_123" };
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: { object: mockSubscription },
    });
    mockHandleSubscriptionDeleted.mockResolvedValue(undefined);

    const res = await callWebhook("{}", "sig_valid");
    expect(res.status).toBe(200);
    expect(mockHandleSubscriptionDeleted).toHaveBeenCalledWith(mockSubscription);
  });

  it("should handle checkout.session.completed with subscription", async () => {
    const mockSession = { subscription: "sub_456" };
    const mockSubscription = { id: "sub_456", customer: "cus_456", status: "active" };
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: mockSession },
    });
    mockSubscriptionsRetrieve.mockResolvedValue(mockSubscription);
    mockSyncSubscriptionStatus.mockResolvedValue(undefined);

    const res = await callWebhook("{}", "sig_valid");
    expect(res.status).toBe(200);
    expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith("sub_456");
    expect(mockSyncSubscriptionStatus).toHaveBeenCalledWith(mockSubscription);
  });

  it("should return 500 when webhook handler throws", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_err" } },
    });
    mockSyncSubscriptionStatus.mockRejectedValue(new Error("DB error"));

    const res = await callWebhook("{}", "sig_valid");
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Webhook handler failed");
  });
});
