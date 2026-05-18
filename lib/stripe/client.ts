import Stripe from "stripe";
import { getServerEnv } from "@/lib/config";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const env = getServerEnv();
  if (!env) throw new Error("Server environment not configured");
  stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
  return stripeInstance;
}
