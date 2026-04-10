import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[auth/logout] signOut error:", error);
      return NextResponse.json({ success: false, error: "ログアウトに失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/logout] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
