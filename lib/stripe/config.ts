import { z } from "zod";

const stripePriceSchema = z.object({
  STRIPE_PRICE_PRO_MONTHLY: z.string().startsWith("price_"),
  STRIPE_PRICE_PRO_YEARLY: z.string().startsWith("price_"),
});

let cachedPrices: z.infer<typeof stripePriceSchema> | null = null;

export function getStripePrices(): z.infer<typeof stripePriceSchema> {
  if (cachedPrices) return cachedPrices;
  cachedPrices = stripePriceSchema.parse({
    STRIPE_PRICE_PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
    STRIPE_PRICE_PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY,
  });
  return cachedPrices;
}

export const VALID_PRICE_IDS = () => {
  const prices = getStripePrices();
  return [prices.STRIPE_PRICE_PRO_MONTHLY, prices.STRIPE_PRICE_PRO_YEARLY] as const;
};
