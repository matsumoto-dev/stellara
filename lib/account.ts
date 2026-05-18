export interface AccountClient {
  from(table: string): {
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
  auth: {
    signOut(): Promise<{ error: { message: string } | null }>;
    admin: {
      deleteUser(id: string): Promise<{ error: { message: string } | null }>;
    };
  };
}

export interface DeleteAccountResult {
  readonly success: boolean;
  readonly deletedAt: string;
  readonly hardDeleteAt: string;
}

const GRACE_PERIOD_DAYS = 30;

/**
 * Soft-delete an account by stamping `deleted_at` on the profiles row,
 * then signing the user out. Hard deletion is scheduled 30 days later.
 */
export async function softDeleteAccount(
  client: AccountClient,
  userId: string,
): Promise<DeleteAccountResult> {
  const now = new Date();
  const hardDelete = new Date(now.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await client
    .from("profiles")
    .update({ deleted_at: now.toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete account: ${String(error)}`);
  }

  await client.auth.signOut();

  return {
    success: true,
    deletedAt: now.toISOString(),
    hardDeleteAt: hardDelete.toISOString(),
  };
}
