import { describe, expect, it } from "vitest";
import { type AccountClient, softDeleteAccount } from "@/lib/account";

function createMockClient(overrides?: {
  updateData?: Record<string, unknown>;
  error?: unknown;
  signOutError?: { message: string } | null;
}): AccountClient {
  const dbError = overrides?.error ?? null;
  const signOutError = overrides?.signOutError ?? null;

  return {
    from: () => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: overrides?.updateData ?? {
                  id: "user-1",
                  deleted_at: new Date().toISOString(),
                },
                error: dbError,
              }),
          }),
        }),
      }),
    }),
    auth: {
      signOut: () => Promise.resolve({ error: signOutError }),
      admin: {
        deleteUser: () => Promise.resolve({ error: null }),
      },
    },
  };
}

describe("softDeleteAccount", () => {
  it("returns success with correct deletedAt and hardDeleteAt on success", async () => {
    const before = Date.now();
    const client = createMockClient();

    const result = await softDeleteAccount(client, "user-1");

    const after = Date.now();
    expect(result.success).toBe(true);

    const deletedAt = new Date(result.deletedAt).getTime();
    expect(deletedAt).toBeGreaterThanOrEqual(before);
    expect(deletedAt).toBeLessThanOrEqual(after);

    const hardDeleteAt = new Date(result.hardDeleteAt).getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    expect(hardDeleteAt - deletedAt).toBeCloseTo(thirtyDaysMs, -3);
  });

  it("hardDeleteAt is exactly 30 days after deletedAt", async () => {
    const client = createMockClient();

    const result = await softDeleteAccount(client, "user-1");

    const deletedAt = new Date(result.deletedAt).getTime();
    const hardDeleteAt = new Date(result.hardDeleteAt).getTime();
    const diffDays = (hardDeleteAt - deletedAt) / (24 * 60 * 60 * 1000);

    expect(diffDays).toBe(30);
  });

  it("throws when the DB update returns an error", async () => {
    const client = createMockClient({
      error: { message: "DB constraint violation" },
    });

    await expect(softDeleteAccount(client, "user-1")).rejects.toThrow("Failed to delete account");
  });

  it("calls signOut after the DB update succeeds", async () => {
    let signOutCalled = false;
    const client = createMockClient();
    client.auth.signOut = () => {
      signOutCalled = true;
      return Promise.resolve({ error: null });
    };

    await softDeleteAccount(client, "user-1");

    expect(signOutCalled).toBe(true);
  });

  it("does not call signOut when the DB update fails", async () => {
    let signOutCalled = false;
    const client = createMockClient({
      error: { message: "DB error" },
    });
    client.auth.signOut = () => {
      signOutCalled = true;
      return Promise.resolve({ error: null });
    };

    await expect(softDeleteAccount(client, "user-1")).rejects.toThrow();
    expect(signOutCalled).toBe(false);
  });

  it("returns readonly result shape (success, deletedAt, hardDeleteAt)", async () => {
    const client = createMockClient();

    const result = await softDeleteAccount(client, "user-1");

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("deletedAt");
    expect(result).toHaveProperty("hardDeleteAt");
    expect(typeof result.deletedAt).toBe("string");
    expect(typeof result.hardDeleteAt).toBe("string");
  });
});
