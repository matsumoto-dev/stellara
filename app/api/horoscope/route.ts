import { NextResponse } from "next/server";
import { generateHoroscope } from "@/lib/astrology/reading";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import type { SunSign } from "@/lib/db/types";

function getDayOfWeek(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Get user's profile for sun sign
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("sun_sign")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const sign = profile.sun_sign as SunSign;
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
