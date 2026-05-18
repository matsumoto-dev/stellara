import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  chatVarsSchema,
  personalReadingVarsSchema,
  tarotVarsSchema,
} from "@/lib/astrology/prompts/types";
import {
  generateChatResponse,
  generatePersonalReading,
  generateTarotReading,
} from "@/lib/astrology/reading";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { READING_TYPES } from "@/lib/db/types";
import { checkRateLimit, type RateLimitClient, type RateLimitWindow } from "@/lib/rate-limit";
import { checkFeatureAccess, type Feature } from "@/lib/subscription";

const readingRequestSchema = z.object({
  type: z.enum(READING_TYPES),
  variables: z.record(z.string(), z.unknown()),
});

/**
 * Determine the rate-limit counting window for the given plan + action combination.
 *
 * - free  + personal → lifetime (onboarding: 1 reading ever)
 * - pro   + chat     → monthly  (Pro: 20 chats / month)
 * - all others       → daily    (default)
 */
function getRateLimitWindow(plan: string, action: string): RateLimitWindow {
  if (plan === "free" && action === "personal") return "lifetime";
  if (plan === "pro" && action === "chat") return "monthly";
  return "daily";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const parsed = readingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "リクエストが不正です", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { type, variables } = parsed.data;

    // Get user profile for plan + sun sign
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, sun_sign, birth_date")
      .eq("id", user.id)
      .single();

    const plan = (profile?.plan as string) ?? "free";

    // ── Feature gate: Pro-only features ──────────────────────────────────────
    const access = checkFeatureAccess(plan as "free" | "pro", type as Feature);
    if (!access.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "この機能にはProプランが必要です",
          reason: access.reason,
          upgradeRequired: true,
        },
        { status: 402 },
      );
    }

    // ── Rate limit check ──────────────────────────────────────────────────────
    const window = getRateLimitWindow(plan, type);
    const rateResult = await checkRateLimit(supabase as unknown as RateLimitClient, {
      userId: user.id,
      action: type,
      plan,
      window,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "利用回数の上限に達しました",
          remaining: rateResult.remaining,
          resetAt: rateResult.resetAt,
          limit: rateResult.limit,
        },
        { status: 429 },
      );
    }

    let result: import("@/lib/astrology/reading").ReadingResult | undefined;

    switch (type) {
      case "personal": {
        const enrichedVars = {
          ...variables,
          sign: profile?.sun_sign ?? "aries",
          birth_date: profile?.birth_date ?? "2000-01-01",
        };
        const vars = personalReadingVarsSchema.safeParse(enrichedVars);
        if (!vars.success) {
          return NextResponse.json(
            { success: false, error: "リクエストが不正です" },
            { status: 400 },
          );
        }
        result = await generatePersonalReading(vars.data);
        break;
      }
      case "tarot": {
        const vars = tarotVarsSchema.safeParse(variables);
        if (!vars.success) {
          return NextResponse.json(
            { success: false, error: "リクエストが不正です" },
            { status: 400 },
          );
        }
        result = await generateTarotReading(vars.data);
        break;
      }
      case "chat": {
        const enrichedVars = {
          ...variables,
          sign: profile?.sun_sign ?? "aries",
        };
        const vars = chatVarsSchema.safeParse(enrichedVars);
        if (!vars.success) {
          return NextResponse.json(
            { success: false, error: "リクエストが不正です" },
            { status: 400 },
          );
        }
        result = await generateChatResponse(vars.data);
        break;
      }
      case "compatibility": {
        // Pro-only: blocked by feature gate above; this branch is unreachable for free users.
        return NextResponse.json(
          { success: false, error: "相性鑑定は準備中です" },
          { status: 501 },
        );
      }
      default:
        return NextResponse.json(
          { success: false, error: "不明な鑑定タイプです" },
          { status: 400 },
        );
    }

    // Save reading to DB
    if (!result.rejected) {
      await supabase.from("readings").insert({
        user_id: user.id,
        type,
        content: result.content,
        prompt_version: result.promptVersion,
        metadata: { model: result.model, tokenUsage: result.tokenUsage },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: result.content,
        type,
        rejected: result.rejected ?? false,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("[reading] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
