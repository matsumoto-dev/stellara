"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("auth.signup");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsConsent, setTermsConsent] = useState(false);
  const [entertainmentConsent, setEntertainmentConsent] = useState(false);

  const canSubmit = termsConsent && entertainmentConsent;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      email: form.get("email"),
      password: form.get("password"),
      birth_date: form.get("birth_date"),
      display_name: form.get("display_name") || undefined,
      consent: {
        terms_and_privacy: termsConsent,
        entertainment_disclaimer: entertainmentConsent,
      },
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      router.push("/dashboard");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="font-heading text-3xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input id="email" name="email" type="email" label={t("email")} required />
        <Input
          id="password"
          name="password"
          type="password"
          label={t("password")}
          required
          minLength={8}
        />
        <Input id="birth_date" name="birth_date" type="date" label={t("birthDate")} required />
        <Input id="display_name" name="display_name" type="text" label={t("displayName")} />

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2">
            <input
              id="terms_consent"
              type="checkbox"
              checked={termsConsent}
              onChange={(e) => setTermsConsent(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms_consent" className="text-sm text-text-muted">
              I agree to the{" "}
              <Link href="/terms" className="text-accent hover:underline" target="_blank">
                {tCommon("termsLink")}
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline" target="_blank">
                {tCommon("privacyLink")}
              </Link>
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="entertainment_consent"
              type="checkbox"
              checked={entertainmentConsent}
              onChange={(e) => setEntertainmentConsent(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="entertainment_consent" className="text-sm text-text-muted">
              {t("entertainmentConsent")}
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} disabled={!canSubmit} className="w-full" size="lg">
          {t("submit")}
        </Button>
      </form>
      <p className="mt-4 text-text-muted text-sm">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-accent hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
