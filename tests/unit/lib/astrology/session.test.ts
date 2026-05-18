import { describe, expect, it } from "vitest";
import {
  addMessage,
  createSession,
  endSession,
  getSessionHistory,
  getTurnLimit,
  incrementTurn,
  type SessionClient,
} from "@/lib/astrology/session";

function createMockClient(overrides?: {
  insertData?: Record<string, unknown>;
  selectData?: Record<string, unknown>[] | Record<string, unknown>;
  updateData?: Record<string, unknown>;
  error?: unknown;
}): SessionClient {
  const error = overrides?.error ?? null;

  return {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: overrides?.insertData ?? { id: "session-1" },
              error,
            }),
        }),
      }),
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({
              data: Array.isArray(overrides?.selectData) ? overrides.selectData : [],
              error,
            }),
          single: () =>
            Promise.resolve({
              data: Array.isArray(overrides?.selectData)
                ? overrides.selectData[0]
                : (overrides?.selectData ?? null),
              error,
            }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: overrides?.updateData ?? { id: "session-1" },
                error,
              }),
          }),
        }),
      }),
    }),
  };
}

describe("getTurnLimit", () => {
  it("should return correct limits for free chat", () => {
    expect(getTurnLimit("free", "chat")).toBe(5);
  });

  it("should return correct limits for pro chat", () => {
    expect(getTurnLimit("pro", "chat")).toBe(30);
  });

  it("should return correct limits for free tarot", () => {
    expect(getTurnLimit("free", "tarot")).toBe(1);
  });

  it("should return correct limits for pro personal", () => {
    expect(getTurnLimit("pro", "personal")).toBe(10);
  });

  it("should default to free limits for unknown plan", () => {
    expect(getTurnLimit("unknown", "chat")).toBe(5);
  });
});

describe("createSession", () => {
  it("should create a session with correct parameters", async () => {
    const mockData = {
      id: "session-1",
      user_id: "user-1",
      type: "chat",
      turn_count: 0,
      turn_limit: 5,
      created_at: "2026-04-02T00:00:00Z",
      ended_at: null,
    };
    const client = createMockClient({ insertData: mockData });

    const session = await createSession(client, "user-1", "chat", "free");
    expect(session.id).toBe("session-1");
    expect(session.turn_count).toBe(0);
    expect(session.turn_limit).toBe(5);
  });

  it("should throw on insert error", async () => {
    const client = createMockClient({
      insertData: null as unknown as Record<string, unknown>,
      error: { message: "Insert failed" },
    });

    await expect(createSession(client, "user-1", "chat", "free")).rejects.toThrow(
      "Failed to create session",
    );
  });
});

describe("addMessage", () => {
  it("should add a message to a session", async () => {
    const mockData = {
      id: "msg-1",
      session_id: "session-1",
      role: "user",
      content: "Hello",
      created_at: "2026-04-02T00:00:00Z",
    };
    const client = createMockClient({ insertData: mockData });

    const msg = await addMessage(client, "session-1", "user", "Hello");
    expect(msg.id).toBe("msg-1");
    expect(msg.role).toBe("user");
  });

  it("should throw on insert error", async () => {
    const client = createMockClient({
      insertData: null as unknown as Record<string, unknown>,
      error: { message: "Failed" },
    });

    await expect(addMessage(client, "session-1", "user", "Hello")).rejects.toThrow(
      "Failed to add message",
    );
  });
});

describe("getSessionHistory", () => {
  it("should return messages in order", async () => {
    const messages = [
      {
        id: "msg-1",
        session_id: "s-1",
        role: "user",
        content: "Hi",
        created_at: "2026-04-02T00:00:00Z",
      },
      {
        id: "msg-2",
        session_id: "s-1",
        role: "assistant",
        content: "Hello!",
        created_at: "2026-04-02T00:00:01Z",
      },
    ];
    const client = createMockClient({ selectData: messages });

    const history = await getSessionHistory(client, "s-1");
    expect(history).toHaveLength(2);
    expect(history[0].role).toBe("user");
    expect(history[1].role).toBe("assistant");
  });
});

describe("incrementTurn", () => {
  it("should increment turn count when within limit", async () => {
    const sessionData = { id: "s-1", turn_count: 2, turn_limit: 5 };
    const client = createMockClient({ selectData: sessionData });

    const result = await incrementTurn(client, "s-1");
    expect(result.allowed).toBe(true);
    expect(result.currentTurn).toBe(3);
    expect(result.turnLimit).toBe(5);
  });

  it("should reject when turn limit reached", async () => {
    const sessionData = { id: "s-1", turn_count: 5, turn_limit: 5 };
    const client = createMockClient({ selectData: sessionData });

    const result = await incrementTurn(client, "s-1");
    expect(result.allowed).toBe(false);
    expect(result.currentTurn).toBe(5);
  });

  it("should throw if session not found", async () => {
    const client = createMockClient({
      selectData: null as unknown as Record<string, unknown>,
      error: { message: "Not found" },
    });

    await expect(incrementTurn(client, "nonexistent")).rejects.toThrow("Session not found");
  });
});

describe("endSession", () => {
  it("should end a session", async () => {
    const client = createMockClient({
      updateData: { id: "s-1", ended_at: "2026-04-02T12:00:00Z" },
    });

    await expect(endSession(client, "s-1")).resolves.toBeUndefined();
  });

  it("should throw on update error", async () => {
    const client = createMockClient({
      updateData: null as unknown as Record<string, unknown>,
      error: { message: "Failed" },
    });

    await expect(endSession(client, "s-1")).rejects.toThrow("Failed to end session");
  });
});
