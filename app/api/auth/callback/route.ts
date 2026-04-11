import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

/**
 * Auth callback handler. Used for:
 * - OAuth flows (Google, etc.)
 * - Email confirmation links from Supabase signup
 * - Password reset links
 *
 * Supabase appends `?code=<pkce_code>` to the configured redirect URL.
 * We exchange the code for a session and forward the user to `next` (default /dashboard).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Supabase may redirect with ?error=... if verification fails
  if (errorParam) {
    console.error("[auth/callback] supabase error:", errorParam, errorDescription);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  if (!code) {
    console.error("[auth/callback] missing code in callback");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
