import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/db/server";
import type { PlanType, SubscriptionStatus } from "@/lib/db/types";
import { isEUCountry } from "@/lib/legal/eu-consent";
import { SettingsContent } from "./settings-content";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, subscription_period_end")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan as PlanType) ?? "free";
  const subscriptionStatus = (profile?.subscription_status as SubscriptionStatus) ?? "none";
  const periodEnd = (profile?.subscription_period_end as string) ?? null;
  const monthlyPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY ?? "";
  const stripeConfigured = monthlyPriceId.startsWith("price_");

  // Detect EU/EEA visitors via Vercel's geo header (x-vercel-ip-country)
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country");
  const isEU = isEUCountry(countryCode);

  return (
    <SettingsContent
      plan={plan}
      subscriptionStatus={subscriptionStatus}
      periodEnd={periodEnd}
      monthlyPriceId={monthlyPriceId}
      stripeConfigured={stripeConfigured}
      isEU={isEU}
      countryCode={countryCode}
    />
  );
}
