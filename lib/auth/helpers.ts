import type { User } from "@supabase/supabase-js";

export interface AuthClient {
  auth: {
    getUser(): Promise<{
      data: { user: User | null };
      error: { message: string } | null;
    }>;
    signOut(): Promise<{ error: { message: string } | null }>;
  };
}

/**
 * Get the current authenticated user, or null if not authenticated.
 */
export async function getCurrentUser(client: AuthClient): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Get the current authenticated user, or throw if not authenticated.
 * Use in API routes that require authentication.
 */
export async function requireAuth(client: AuthClient): Promise<User> {
  const user = await getCurrentUser(client);
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  return user;
}

/**
 * Sign out the current user.
 */
export async function signOut(client: AuthClient): Promise<void> {
  const { error } = await client.auth.signOut();
  if (error) {
    throw new AuthError(`Sign out failed: ${error.message}`, 500);
  }
}

export class AuthError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}
