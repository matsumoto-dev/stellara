import { createClient } from "@supabase/supabase-js";
import { getClientEnv, getServerEnv } from "@/lib/config";

/**
 * Creates a Supabase client with service_role key.
 * Bypasses RLS — use only in server-side contexts (webhooks, admin operations).
 */
export function createAdminClient() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();
  if (!serverEnv) throw new Error("Server environment not configured");
  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}
