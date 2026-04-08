import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { checkFeatureAccess } from "@/lib/subscription";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Get user plan for feature gate
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = (profile?.plan as "free" | "pro") ?? "free";

    const access = checkFeatureAccess(plan, "reading_history");
    if (!access.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Pro subscription required to view reading history",
          upgradeRequired: true,
        },
        { status: 402 },
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get("limit");
    const rawOffset = searchParams.get("offset");
    const parsed = querySchema.safeParse({
      limit: rawLimit !== null ? rawLimit : undefined,
      offset: rawOffset !== null ? rawOffset : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const { limit, offset } = parsed.data;

    const { data: readings, error, count } = await supabase
      .from("readings")
      .select("id, type, content, prompt_version, metadata, created_at", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to fetch readings" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        readings: readings ?? [],
        total: count ?? 0,
        limit,
        offset,
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
