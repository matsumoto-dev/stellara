import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireAuth } from "@/lib/auth/helpers";
import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import { VALID_PRICE_IDS } from "@/lib/stripe/config";
import { createCheckoutSession } from "@/lib/stripe/helpers";

const euConsentSchema = z.object({
  immediateDelivery: z.literal(true),
  waiverAcknowledged: z.literal(true),
  countryCode: z.string().length(2),
});

const checkoutRequestSchema = z.object({
  priceId: z.string().startsWith("price_"),
  euConsent: euConsentSchema.optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    // Validate price ID against known prices
    const validPrices = VALID_PRICE_IDS();
    if (!validPrices.includes(parsed.data.priceId)) {
      return NextResponse.json({ success: false, error: "Invalid price ID" }, { status: 400 });
    }

    // Record EU Art.16(m) consent before creating checkout session
    if (parsed.data.euConsent) {
      const { countryCode } = parsed.data.euConsent;
      const admin = createAdminClient();
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

      await admin.from("consent_records").insert([
        {
          user_id: user.id,
          consent_type: "eu_art16m",
          ip_address: ip,
          country_code: countryCode,
        },
      ]);
    }

    const baseUrl = new URL(request.url).origin;
    const url = await createCheckoutSession(
      user.id,
      user.email ?? "",
      parsed.data.priceId,
      baseUrl,
    );

    return NextResponse.json({ success: true, url });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("[stripe/checkout] unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "決済サービスに接続できませんでした。しばらくしてからお試しください。" },
      { status: 500 },
    );
  }
}
