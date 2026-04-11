import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { translateAuthError } from "@/lib/auth/error-messages";
import { createClient } from "@/lib/db/server";

const schema = z.object({
  email: z.string().email(),
});

/**
 * Resend the email confirmation link to a user who has signed up but not yet
 * confirmed their email address.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "メールアドレスが正しくありません" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const origin = new URL(request.url).origin;
    const emailRedirectTo = `${origin}/api/auth/callback?next=/dashboard`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: parsed.data.email,
      options: { emailRedirectTo },
    });

    if (error) {
      console.error("[auth/resend-confirmation] failed:", error);
      return NextResponse.json(
        { success: false, error: translateAuthError(error) },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/resend-confirmation] unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
