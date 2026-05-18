import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
});

const stripePublicSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
});

let cachedClientEnv: z.infer<typeof clientSchema> | null = null;

export function getClientEnv(): z.infer<typeof clientSchema> {
  if (cachedClientEnv) return cachedClientEnv;
  cachedClientEnv = clientSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  return cachedClientEnv;
}

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;
let serverEnvParsed = false;

export function getServerEnv(): z.infer<typeof serverSchema> | null {
  if (serverEnvParsed) return cachedServerEnv;
  serverEnvParsed = true;
  const result = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  });
  if (result.success) {
    cachedServerEnv = result.data;
    return cachedServerEnv;
  }
  return null;
}

let cachedStripePublicEnv: z.infer<typeof stripePublicSchema> | null = null;
let stripePublicParsed = false;

export function getStripePublicEnv(): z.infer<typeof stripePublicSchema> | null {
  if (stripePublicParsed) return cachedStripePublicEnv;
  stripePublicParsed = true;
  const result = stripePublicSchema.safeParse({
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
  if (result.success) {
    cachedStripePublicEnv = result.data;
    return cachedStripePublicEnv;
  }
  return null;
}
