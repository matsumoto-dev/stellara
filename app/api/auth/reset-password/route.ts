import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/db/server";

const resetSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "メールアドレスが正しくありません" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);

    if (error) {
      // Don't reveal whether the email exists
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/reset-password] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
