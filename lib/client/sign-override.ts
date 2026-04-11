import { SUN_SIGNS, type SunSign } from "@/lib/db/types";

const SIGN_OVERRIDE_KEY = "stellara:viewing_sign";

/**
 * Read the temporary sign override from sessionStorage.
 * Returns null if no override is set, or if the stored value is invalid.
 */
export function readSignOverride(): SunSign | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(SIGN_OVERRIDE_KEY);
    if (v && (SUN_SIGNS as readonly string[]).includes(v)) {
      return v as SunSign;
    }
  } catch {
    // sessionStorage may be blocked
  }
  return null;
}

/**
 * Write a temporary sign override to sessionStorage.
 * Pass null to clear.
 */
export function writeSignOverride(sign: SunSign | null): void {
  if (typeof window === "undefined") return;
  try {
    if (sign) {
      window.sessionStorage.setItem(SIGN_OVERRIDE_KEY, sign);
    } else {
      window.sessionStorage.removeItem(SIGN_OVERRIDE_KEY);
    }
  } catch {
    // ignore
  }
}

/** Convenience: clear the override (used at login/signup/logout). */
export function clearSignOverride(): void {
  writeSignOverride(null);
}
