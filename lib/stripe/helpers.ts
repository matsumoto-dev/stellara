import type Stripe from "stripe";
import { createAdminClient } from "@/lib/db/admin";
import { getStripe } from "./client";

/**
 * Get existing Stripe customer ID from DB, or create a new Stripe customer.
 */
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await admin.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", userId);

  return customer.id;
}

/**
 * Create a Stripe Checkout Session for subscription.
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  baseUrl: string,
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId, email);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${baseUrl}/settings?canceled=true`,
    metadata: { supabase_user_id: userId },
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  return session.url;
}

/**
 * Create a Stripe Customer Portal session for subscription management.
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid";

/**
 * Sync Stripe subscription state to the profiles table.
 * Called from webhook handlers.
 */
export async function syncSubscriptionStatus(subscription: Stripe.Subscription): Promise<void> {
  const admin = createAdminClient();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  // Look up user by stripe_customer_id
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) return;

  const status = subscription.status as SubscriptionStatus;
  const plan = status === "active" || status === "trialing" ? "pro" : "free";
  const periodEnd = subscription.items.data[0]?.current_period_end
    ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
    : null;

  await admin
    .from("profiles")
    .update({
      plan,
      subscription_status: status,
      stripe_subscription_id: subscription.id,
      subscription_period_end: periodEnd,
    })
    .eq("id", profile.id);
}

/**
 * Handle subscription deletion — reset user to free plan.
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const admin = createAdminClient();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) return;

  await admin
    .from("profiles")
    .update({
      plan: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
      subscription_period_end: null,
    })
    .eq("id", profile.id);
}
