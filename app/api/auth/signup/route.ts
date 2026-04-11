import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSunSign } from "@/lib/astrology/chart";
import { translateAuthError } from "@/lib/auth/error-messages";
import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import type { SUN_SIGNS } from "@/lib/db/types";

const consentSchema = z.object({
  terms_and_privacy: z.literal(true),
  entertainment_disclaimer: z.literal(true),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  display_name: z.string().optional(),
  consent: consentSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "入力内容に誤りがあります", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password, birth_date, display_name } = parsed.data;

    let sunSign: (typeof SUN_SIGNS)[number];
    try {
      sunSign = getSunSign(birth_date);
    } catch {
      return NextResponse.json({ success: false, error: "生年月日が正しくありません" }, { status: 400 });
    }

    // ── Create the user via the admin API ─────────────────────────
    //
    // We bypass the regular `supabase.auth.signUp()` flow for two reasons:
    //
    // 1. When "Confirm email" is enabled in Supabase, signUp() returns a *fake*
    //    user object (email enumeration protection) without actually creating a
    //    row in auth.users. This causes the subsequent profile upsert to fail
    //    with a foreign key violation (profiles.id → auth.users.id).
    //
    // 2. For a portfolio app we don't want the email confirmation friction:
    //    evaluators should be able to sign up and immediately use the product
    //    without checking their inbox.
    //
    // `admin.auth.admin.createUser()` always creates a real auth.users row and
    // `email_confirm: true` marks it as confirmed so the user can sign in
    // immediately afterwards.
    const admin = createAdminClient();

    const { data: createData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: display_name ? { display_name } : undefined,
    });

    if (createError || !createData.user) {
      console.error("[auth/signup] admin.createUser failed:", createError);
      return NextResponse.json(
        { success: false, error: translateAuthError(createError) },
        { status: 400 },
      );
    }

    const userId = createData.user.id;

    // ── Insert profile via admin client (bypasses RLS) ────────────
    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          display_name: display_name ?? null,
          birth_date,
          sun_sign: sunSign,
          plan: "free",
        },
        { onConflict: "id" },
      );

    if (profileError) {
      console.error("[auth/signup] profile upsert failed:", profileError);
      // Roll back the user we just created so the email isn't stuck
      await admin.auth.admin.deleteUser(userId).catch((e) => {
        console.error("[auth/signup] rollback deleteUser failed:", e);
      });
      return NextResponse.json(
        {
          success: false,
          error: "プロフィールの作成に失敗しました",
          debug: {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
          },
        },
        { status: 500 },
      );
    }

    // ── Record consent ────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const countryCode = request.headers.get("x-vercel-ip-country") ?? undefined;

    await admin.from("consent_records").insert({
      user_id: userId,
      consent_type: "terms_and_privacy",
      ip_address: ip,
      country_code: countryCode,
    });

    await admin.from("consent_records").insert({
      user_id: userId,
      consent_type: "entertainment_disclaimer",
      ip_address: ip,
      country_code: countryCode,
    });

    // ── Sign the user in to establish a session cookie ────────────
    // This uses the SSR-aware client so the session is set on the response.
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("[auth/signup] auto sign-in failed:", signInError);
      // The user was created successfully — they can log in manually.
      return NextResponse.json({
        success: true,
        data: { userId, sunSign, needsLogin: true, email },
      });
    }

    return NextResponse.json({
      success: true,
      data: { userId, sunSign, needsLogin: false, email },
    });
  } catch (error) {
    console.error("[auth/signup] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
