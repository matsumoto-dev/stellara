import { describe, expect, it, vi } from "vitest";
import {
  type AuthClient,
  AuthError,
  getCurrentUser,
  requireAuth,
  signOut,
} from "@/lib/auth/helpers";

function createMockClient(
  user: Record<string, unknown> | null,
  error: { message: string } | null = null,
): AuthClient {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };
}

describe("getCurrentUser", () => {
  it("should return user when authenticated", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    const client = createMockClient(mockUser);

    const user = await getCurrentUser(client);
    expect(user).toEqual(mockUser);
  });

  it("should return null when not authenticated", async () => {
    const client = createMockClient(null);

    const user = await getCurrentUser(client);
    expect(user).toBeNull();
  });

  it("should return null on error", async () => {
    const client = createMockClient(null, { message: "Token expired" });

    const user = await getCurrentUser(client);
    expect(user).toBeNull();
  });
});

describe("requireAuth", () => {
  it("should return user when authenticated", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    const client = createMockClient(mockUser);

    const user = await requireAuth(client);
    expect(user).toEqual(mockUser);
  });

  it("should throw AuthError when not authenticated", async () => {
    const client = createMockClient(null);

    await expect(requireAuth(client)).rejects.toThrow(AuthError);
    await expect(requireAuth(client)).rejects.toThrow("Authentication required");
  });

  it("should throw with 401 status code", async () => {
    const client = createMockClient(null);

    try {
      await requireAuth(client);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);
      expect((error as AuthError).statusCode).toBe(401);
    }
  });
});

describe("signOut", () => {
  it("should sign out successfully", async () => {
    const client = createMockClient({ id: "user-1" });

    await expect(signOut(client)).resolves.toBeUndefined();
    expect(client.auth.signOut).toHaveBeenCalled();
  });

  it("should throw on sign out error", async () => {
    const client: AuthClient = {
      auth: {
        getUser: vi.fn(),
        signOut: vi.fn().mockResolvedValue({ error: { message: "Network error" } }),
      },
    };

    await expect(signOut(client)).rejects.toThrow("Sign out failed: Network error");
  });
});

describe("AuthError", () => {
  it("should have correct name and statusCode", () => {
    const error = new AuthError("Test error", 403);
    expect(error.name).toBe("AuthError");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(403);
    expect(error).toBeInstanceOf(Error);
  });
});
