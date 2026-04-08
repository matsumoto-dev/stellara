import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyHoroscope } from "@/lib/astrology/reading";
import { createAdminClient } from "@/lib/db/admin";
import { SUN_SIGNS } from "@/lib/db/types";

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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd(weekStart);

  const results: { sign: string; status: "ok" | "skipped" | "error"; reason?: string }[] = [];

  for (const sign of SUN_SIGNS) {
    // Skip if already generated for this week
    const { data: existing } = await supabase
      .from("weekly_horoscopes")
      .select("id")
      .eq("sign", sign)
      .eq("week_start", weekStart)
      .single();

    if (existing) {
      results.push({ sign, status: "skipped" });
      continue;
    }

    const result = await generateWeeklyHoroscope({ sign, week_start: weekStart, week_end: weekEnd });

    if (result.rejected) {
      results.push({ sign, status: "error", reason: result.rejectionReason });
      continue;
    }

    const { error: insertError } = await supabase.from("weekly_horoscopes").insert({
      sign,
      week_start: weekStart,
      content: result.content,
      prompt_version: result.promptVersion,
    });

    if (insertError) {
      results.push({ sign, status: "error", reason: insertError.message });
    } else {
      results.push({ sign, status: "ok" });
    }
  }

  const generated = results.filter((r) => r.status === "ok").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    success: errors === 0,
    data: { week_start: weekStart, week_end: weekEnd, generated, skipped, errors, results },
  });
}
