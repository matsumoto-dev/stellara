import { NextResponse } from "next/server";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { createPortalSession } from "@/lib/stripe/helpers";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: "No active subscription" },
        { status: 400 },
      );
    }

    const returnUrl = `${new URL(request.url).origin}/settings`;
    const url = await createPortalSession(profile.stripe_customer_id, returnUrl);

    return NextResponse.json({ success: true, url });
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
