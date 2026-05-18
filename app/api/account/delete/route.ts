import { NextResponse } from "next/server";
import { type AccountClient, softDeleteAccount } from "@/lib/account";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);
    const result = await softDeleteAccount(supabase as unknown as AccountClient, user.id);

    return NextResponse.json({
      success: true,
      data: {
        deletedAt: result.deletedAt,
        hardDeleteAt: result.hardDeleteAt,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("[account/delete] unhandled error:", error);
    return NextResponse.json({ success: false, error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
