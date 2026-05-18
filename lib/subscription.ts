// ---------------------------------------------------------------------------
// Subscription feature gate — Pro/Free access control
//
// All feature-level access decisions go through this module.
// Rate limits (daily/monthly counts) are handled separately in rate-limit.ts.
// ---------------------------------------------------------------------------

import type { PlanType } from "@/lib/db/types";

// ---------------------------------------------------------------------------
// Feature definitions
// ---------------------------------------------------------------------------

/**
 * Features available in the app.
 *
 * Free features (with limits):
 *   horoscope    — 1/day
 *   personal     — 1 lifetime (onboarding)
 *   tarot        — 1/day
 *
 * Pro-only features:
 *   chat         — 20/month
 *   compatibility — unlimited
 *   reading_history — unlimited
 */
export const ALL_FEATURES = [
  "horoscope",
  "personal",
  "tarot",
  "chat",
  "compatibility",
  "reading_history",
] as const;

export type Feature = (typeof ALL_FEATURES)[number];

/** Features that require a Pro subscription. Free users are blocked entirely. */
export const PRO_ONLY_FEATURES: ReadonlySet<Feature> = new Set<Feature>([
  "chat",
  "compatibility",
  "reading_history",
]);

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface FeatureAccess {
  readonly allowed: boolean;
  /** Populated only when allowed is false */
  readonly reason?: "pro_required";
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** Returns true if the plan is Pro (active or trialing). */
export function isPro(plan: PlanType): boolean {
  return plan === "pro";
}

/** Returns true if the feature is gated to Pro subscribers only. */
export function isProRequired(feature: Feature): boolean {
  return PRO_ONLY_FEATURES.has(feature);
}

/**
 * Check whether a user with the given plan can access a feature.
 *
 * This does NOT check usage counts — call checkRateLimit separately for that.
 *
 * @example
 * const access = checkFeatureAccess("free", "chat");
 * // { allowed: false, reason: "pro_required" }
 *
 * const access2 = checkFeatureAccess("pro", "chat");
 * // { allowed: true }
 */
export function checkFeatureAccess(plan: PlanType, feature: Feature): FeatureAccess {
  if (isProRequired(feature) && !isPro(plan)) {
    return { allowed: false, reason: "pro_required" };
  }
  return { allowed: true };
}
