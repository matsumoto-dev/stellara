import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { SHARE_CHANNELS, SHARE_READING_TYPES, shareEventInsertSchema } from "@/lib/db/types";

const requestSchema = z.object({
  channel: z.enum(SHARE_CHANNELS),
  reading_type: z.enum(SHARE_READING_TYPES),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const user = await getCurrentUser(supabase);

    const payload = shareEventInsertSchema.parse({
      channel: parsed.data.channel,
      reading_type: parsed.data.reading_type,
      ...(user ? { user_id: user.id } : {}),
    });

    const { error } = await supabase.from("share_events").insert(payload);

    if (error) {
      console.error("[share/track] insert error:", error.message);
      return NextResponse.json({ success: false, error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[share/track] unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
