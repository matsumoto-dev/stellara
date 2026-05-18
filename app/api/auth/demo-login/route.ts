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
      { success: false, error: "デモアカウントが見つかりませんでした" },
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
        { success: false, error: "デモログインに失敗しました" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { userId: data.user.id },
    });
  } catch (error) {
    console.error("[auth/demo-login] unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
