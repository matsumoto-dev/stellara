import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/db/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "入力内容に誤りがあります" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { userId: data.user.id },
    });
  } catch (error) {
    console.error("[auth/login] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
