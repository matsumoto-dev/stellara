/**
 * EU/EEA country detection for Art.16(m) consent flow.
 * Used to conditionally show the immediate delivery consent checkboxes
 * before Pro plan checkout.
 */

const EU_EEA_COUNTRY_CODES = new Set([
  // EU Member States
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
  "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT",
  "NL", "PL", "PT", "RO", "SE", "SI", "SK",
  // EEA (non-EU)
  "IS", "LI", "NO",
]);

/**
 * Returns true if the given ISO 3166-1 alpha-2 country code is in the EU/EEA.
 * Returns false for null/undefined/empty strings.
 */
export function isEUCountry(countryCode: string | null | undefined): boolean {
  if (!countryCode) return false;
  return EU_EEA_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export interface EUConsentData {
  immediateDelivery: boolean;
  waiverAcknowledged: boolean;
  countryCode: string;
}
