import type { MessageRole, SessionMessageRow, SessionRow, SessionType } from "@/lib/db/types";

const TURN_LIMITS: Record<string, Record<SessionType, number>> = {
  free: { chat: 5, tarot: 1, personal: 1 },
  pro: { chat: 30, tarot: 10, personal: 10 },
};

export interface SessionClient {
  from(table: string): {
    insert(data: Record<string, unknown>): {
      select(): {
        single(): Promise<{ data: Record<string, unknown> | null; error: unknown }>;
      };
    };
    select(columns?: string): {
      eq(
        column: string,
        value: string,
      ): {
        order(
          column: string,
          options: { ascending: boolean },
        ): Promise<{
          data: Record<string, unknown>[] | null;
          error: unknown;
        }>;
        single(): Promise<{ data: Record<string, unknown> | null; error: unknown }>;
      };
    };
    update(data: Record<string, unknown>): {
      eq(
        column: string,
        value: string,
      ): {
        select(): {
          single(): Promise<{ data: Record<string, unknown> | null; error: unknown }>;
        };
      };
    };
  };
}

export function getTurnLimit(plan: string, sessionType: SessionType): number {
  const planLimits = TURN_LIMITS[plan] ?? TURN_LIMITS.free;
  return planLimits[sessionType] ?? 5;
}

export async function createSession(
  client: SessionClient,
  userId: string,
  type: SessionType,
  plan: string,
): Promise<SessionRow> {
  const turnLimit = getTurnLimit(plan, type);

  const { data, error } = await client
    .from("sessions")
    .insert({
      user_id: userId,
      type,
      turn_count: 0,
      turn_limit: turnLimit,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create session: ${String(error)}`);
  }

  return data as unknown as SessionRow;
}

export async function addMessage(
  client: SessionClient,
  sessionId: string,
  role: MessageRole,
  content: string,
  tokenCount?: number,
): Promise<SessionMessageRow> {
  const insertData: Record<string, unknown> = {
    session_id: sessionId,
    role,
    content,
  };
  if (tokenCount !== undefined) {
    insertData.token_count = tokenCount;
  }

  const { data, error } = await client
    .from("session_messages")
    .insert(insertData)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to add message: ${String(error)}`);
  }

  return data as unknown as SessionMessageRow;
}

export async function getSessionHistory(
  client: SessionClient,
  sessionId: string,
): Promise<SessionMessageRow[]> {
  const { data, error } = await client
    .from("session_messages")
    .select()
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to get session history: ${String(error)}`);
  }

  return (data ?? []) as unknown as SessionMessageRow[];
}

export async function incrementTurn(
  client: SessionClient,
  sessionId: string,
): Promise<{ allowed: boolean; currentTurn: number; turnLimit: number }> {
  const { data: session, error: fetchError } = await client
    .from("sessions")
    .select()
    .eq("id", sessionId)
    .single();

  if (fetchError || !session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  const currentTurn = (session.turn_count as number) + 1;
  const turnLimit = session.turn_limit as number;

  if (currentTurn > turnLimit) {
    return { allowed: false, currentTurn: currentTurn - 1, turnLimit };
  }

  const { error: updateError } = await client
    .from("sessions")
    .update({ turn_count: currentTurn })
    .eq("id", sessionId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to increment turn: ${String(updateError)}`);
  }

  return { allowed: true, currentTurn, turnLimit };
}

export async function endSession(client: SessionClient, sessionId: string): Promise<void> {
  const { error } = await client
    .from("sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to end session: ${String(error)}`);
  }
}
