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

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error("[auth/signup] auth.signUp failed:", authError);
      return NextResponse.json(
        { success: false, error: translateAuthError(authError) },
        { status: 400 },
      );
    }

    const userId = authData.user.id;

    // Use admin client for profile + consent inserts because the user's session
    // may not be established yet immediately after signUp (especially with email
    // confirmation enabled). Without an active session, RLS policies that check
    // auth.uid() = id would block the insert.
    const admin = createAdminClient();

    const { error: profileError } = await admin.from("profiles").insert({
      id: userId,
      email,
      display_name: display_name ?? null,
      birth_date,
      sun_sign: sunSign,
      plan: "free",
    });

    if (profileError) {
      console.error("[auth/signup] profile insert failed:", profileError);
      return NextResponse.json(
        { success: false, error: "プロフィールの作成に失敗しました" },
        { status: 500 },
      );
    }

    // Record consent (also via admin client)
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

    return NextResponse.json({
      success: true,
      data: { userId, sunSign },
    });
  } catch (error) {
    console.error("[auth/signup] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
