import { NextResponse } from "next/server";
import { z } from "zod";
import { generateHoroscope } from "@/lib/astrology/reading";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { SUN_SIGNS, type SunSign } from "@/lib/db/types";

function getDayOfWeek(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Optional ?sign= query lets the user view a different sign without
    // mutating their profile. Useful for portfolio/demo viewers exploring.
    //
    // Cost note: AI generation is naturally bounded by the daily_horoscopes
    // table's UNIQUE (sign, date) constraint — at most 12 generations per day
    // GLOBALLY (one per zodiac sign), regardless of how many users hit ?sign=.
    // After 12 unique sign requests in a day, all further requests are cache hits.
    // No per-user rate limit is needed for this reason.
    const url = new URL(request.url);
    const querySign = url.searchParams.get("sign");
    const validQuerySign =
      querySign && (SUN_SIGNS as readonly string[]).includes(querySign)
        ? (querySign as SunSign)
        : null;

    // Always look up the profile sign so we can return it in the response.
    // The client uses `profileSign` to know what the user's "real" sign is
    // (so they can reset back to it after switching).
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("sun_sign")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "プロフィールが見つかりませんでした", code: "PROFILE_NOT_FOUND" },
        { status: 404 },
      );
    }

    const profileSign = profile.sun_sign as SunSign;
    const sign: SunSign = validQuerySign ?? profileSign;
    const today = getTodayDate();

    // Check cache first
    const { data: cached } = await supabase
      .from("daily_horoscopes")
      .select()
      .eq("sign", sign)
      .eq("date", today)
      .single();

    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          sign,
          profileSign,
          date: today,
          content: cached.content,
          cached: true,
        },
      });
    }

    // Generate on the fly
    const result = await generateHoroscope({
      sign,
      date: today,
      day_of_week: getDayOfWeek(today),
    });

    // Cache the result
    if (!result.rejected) {
      await supabase.from("daily_horoscopes").insert({
        sign,
        date: today,
        content: result.content,
        prompt_version: result.promptVersion,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        sign,
        profileSign,
        date: today,
        content: result.content,
        cached: false,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("[horoscope] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

const patchSchema = z.object({
  sun_sign: z.enum(SUN_SIGNS),
});

/**
 * PATCH /api/horoscope — set sun_sign on the user's profile, then return today's horoscope.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "星座の値が不正です" }, { status: 400 });
    }

    const sign = parsed.data.sun_sign;

    // Try update first to avoid overwriting existing birth_date
    const { data: updated } = await supabase
      .from("profiles")
      .update({ sun_sign: sign })
      .eq("id", user.id)
      .select("id");

    if (!updated || updated.length === 0) {
      // No profile row exists — insert with placeholder birth_date
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email ?? "",
          sun_sign: sign,
          birth_date: "2000-01-01",
        });

      if (insertError) {
        console.error("[horoscope/PATCH] insert error:", insertError);
        return NextResponse.json({ success: false, error: "星座の保存に失敗しました" }, { status: 500 });
      }
    }

    // Generate today's horoscope with the new sign
    const today = getTodayDate();

    const { data: cached } = await supabase
      .from("daily_horoscopes")
      .select()
      .eq("sign", sign)
      .eq("date", today)
      .single();

    if (cached) {
      return NextResponse.json({
        success: true,
        data: { sign, profileSign: sign, date: today, content: cached.content, cached: true },
      });
    }

    const result = await generateHoroscope({
      sign,
      date: today,
      day_of_week: getDayOfWeek(today),
    });

    if (!result.rejected) {
      await supabase.from("daily_horoscopes").insert({
        sign,
        date: today,
        content: result.content,
        prompt_version: result.promptVersion,
      });
    }

    return NextResponse.json({
      success: true,
      data: { sign, profileSign: sign, date: today, content: result.content, cached: false },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("[horoscope/PATCH] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
