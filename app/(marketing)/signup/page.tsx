"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { StarOrnament, StellaraMark } from "@/components/icons/stellara-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DebugInfo {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("auth.signup");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const [termsConsent, setTermsConsent] = useState(false);
  const [entertainmentConsent, setEntertainmentConsent] = useState(false);

  // Confirmation state — set after successful signup when email confirmation is required
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resentMessage, setResentMessage] = useState<string | null>(null);

  const canSubmit = termsConsent && entertainmentConsent;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setDebug(null);

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
        if (json.debug) setDebug(json.debug);
        return;
      }
      // If email confirmation is required, show the confirmation card
      if (json.data?.needsEmailConfirmation) {
        setConfirmationEmail(json.data.email ?? (body.email as string));
        return;
      }
      // Otherwise (auto-confirm), session is established — go to dashboard
      router.push("/dashboard");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!confirmationEmail) return;
    setResending(true);
    setResentMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: confirmationEmail }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "再送に失敗しました");
        return;
      }
      setResentMessage("確認メールを再送しました。受信トレイをご確認ください。");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setResending(false);
    }
  }

  // ── Confirmation card view ──────────────────────────────────────
  if (confirmationEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
        <Link href="/" className="mb-8 group">
          <StellaraMark
            size={48}
            className="text-gold-leaf drop-shadow-[0_0_16px_rgba(255,217,106,0.5)] group-hover:rotate-45 transition-transform duration-700"
          />
        </Link>

        <div className="w-full max-w-md bg-night-veil/60 backdrop-blur-sm border border-gold-leaf/25 rounded-xl p-8 text-center space-y-5">
          <div className="text-gold-leaf text-4xl drop-shadow-[0_0_16px_rgba(255,217,106,0.5)]" aria-hidden="true">
            ✉
          </div>
          <h2 className="font-heading text-2xl font-semibold text-gold-pale tracking-tight">
            メールをご確認ください
          </h2>
          <p className="text-sm text-text-muted leading-[1.85] font-reading">
            <span className="text-gold-pale break-all">{confirmationEmail}</span>
            {" "}宛に確認メールを送信しました。<br />
            メール内のリンクをクリックして、登録を完了してください。
          </p>
          <p className="text-xs text-text-muted/70 leading-relaxed">
            メールが届かない場合は、迷惑メールフォルダもご確認ください。<br />
            それでも見つからない場合は、下のボタンから再送できます。
          </p>

          {resentMessage && (
            <div className="text-sm text-gold-pale bg-gold-leaf/10 border border-gold-leaf/30 rounded-lg p-3">
              {resentMessage}
            </div>
          )}
          {error && (
            <div className="text-red-300/90 text-sm bg-red-900/20 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleResend}
              loading={resending}
            >
              確認メールを再送する
            </Button>
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-gold-pale transition-colors"
            >
              ログイン画面へ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form view ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <Link href="/" className="mb-8 group">
        <StellaraMark
          size={48}
          className="text-gold-leaf drop-shadow-[0_0_16px_rgba(255,217,106,0.5)] group-hover:rotate-45 transition-transform duration-700"
        />
      </Link>

      <div className="divider-ornament max-w-[14rem] mb-6">
        <StarOrnament size={6} />
      </div>

      <h1
        className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-moonlight mb-2 tracking-tight text-center"
        style={{ wordBreak: "keep-all" }}
      >
        {t("title")}
      </h1>
      <p className="text-text-muted text-sm mb-10 text-center">星があなたを知るための、最初の一歩</p>

      <div className="w-full max-w-sm bg-night-veil/40 backdrop-blur-sm border border-gold-leaf/15 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label htmlFor="terms_consent" className="flex items-start gap-2 cursor-pointer">
              <input
                id="terms_consent"
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                className="mt-1 accent-gold-leaf"
              />
              <span className="text-sm text-text-muted leading-relaxed">
                <Link href="/terms" className="text-gold-pale hover:text-gold-glow transition-colors" target="_blank">
                  {tCommon("termsLink")}
                </Link>
                ・
                <Link href="/privacy" className="text-gold-pale hover:text-gold-glow transition-colors" target="_blank">
                  {tCommon("privacyLink")}
                </Link>
                {" に同意します"}
              </span>
            </label>

            <label htmlFor="entertainment_consent" className="flex items-start gap-2 cursor-pointer">
              <input
                id="entertainment_consent"
                type="checkbox"
                checked={entertainmentConsent}
                onChange={(e) => setEntertainmentConsent(e.target.checked)}
                className="mt-1 accent-gold-leaf"
              />
              <span className="text-sm text-text-muted leading-relaxed">
                {t("entertainmentConsent")}
              </span>
            </label>
          </div>

          {error && (
            <div className="text-red-300/90 text-sm bg-red-900/20 border border-red-400/20 rounded-lg p-3 space-y-2">
              <p>{error}</p>
              {debug && (
                <details className="text-[11px] text-red-200/70">
                  <summary className="cursor-pointer hover:text-red-200">詳細(開発用)</summary>
                  <pre className="whitespace-pre-wrap break-all mt-2 font-mono">
                    {JSON.stringify(debug, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          <Button type="submit" loading={loading} disabled={!canSubmit} className="w-full" size="lg">
            {t("submit")}
          </Button>
        </form>
      </div>
      <p className="mt-6 text-text-muted text-sm">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-gold-pale hover:text-gold-glow transition-colors">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
