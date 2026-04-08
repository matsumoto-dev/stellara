import { NextResponse } from "next/server";
import { generateWeeklyHoroscope } from "@/lib/astrology/reading";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import type { SunSign } from "@/lib/db/types";

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sunday, 1=Monday...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().split("T")[0];
}

function getWeekEnd(weekStart: string): string {
  const monday = new Date(`${weekStart}T00:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() + 6);
  return monday.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("sun_sign")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const sign = profile.sun_sign as SunSign;
    const weekStart = getWeekStart();

    // Check cache first
    const { data: cached } = await supabase
      .from("weekly_horoscopes")
      .select()
      .eq("sign", sign)
      .eq("week_start", weekStart)
      .single();

    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          sign,
          week_start: weekStart,
          week_end: getWeekEnd(weekStart),
          content: cached.content,
          cached: true,
        },
      });
    }

    // Generate on the fly if not cached
    const weekEnd = getWeekEnd(weekStart);
    const result = await generateWeeklyHoroscope({ sign, week_start: weekStart, week_end: weekEnd });

    if (!result.rejected) {
      await supabase.from("weekly_horoscopes").insert({
        sign,
        week_start: weekStart,
        content: result.content,
        prompt_version: result.promptVersion,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        sign,
        week_start: weekStart,
        week_end: weekEnd,
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
