import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

/**
 * Server-side demo login endpoint.
 * Credentials are kept in server-only env vars (DEMO_EMAIL / DEMO_PASSWORD)
 * and never exposed to the client bundle.
 * Session cookies are set automatically via @supabase/ssr createServerClient.
 */
export async function POST() {
  const demoEmail = process.env.DEMO_EMAIL;
  const demoPassword = process.env.DEMO_PASSWORD;

  if (!demoEmail || !demoPassword) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Demo login failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { userId: data.user.id },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
