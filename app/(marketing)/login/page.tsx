"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { StarOrnament, StellaraMark } from "@/components/icons/stellara-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSignOverride } from "@/lib/client/sign-override";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      // Clear any sign override from a previous user/test session
      clearSignOverride();
      router.push("/dashboard");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      clearSignOverride();
      router.push("/dashboard");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setDemoLoading(false);
    }
  }

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
      <p className="text-text-muted text-sm mb-10 text-center">星があなたを待っています</p>

      <div className="w-full max-w-sm bg-night-veil/40 backdrop-blur-sm border border-gold-leaf/15 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input id="email" name="email" type="email" label={t("email")} required />
          <Input id="password" name="password" type="password" label={t("password")} required />
          {error && (
            <div className="text-red-300/90 text-sm bg-red-900/20 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}
          <Button type="submit" loading={loading} className="w-full" size="lg">
            {t("submit")}
          </Button>
        </form>

        <div className="mt-7">
          <div className="relative flex items-center gap-3 mb-5">
            <hr className="flex-1 border-gold-leaf/15" />
            <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] shrink-0">
              {t("demoSeparator")}
            </span>
            <hr className="flex-1 border-gold-leaf/15" />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            loading={demoLoading}
            onClick={handleDemoLogin}
          >
            {t("demoButton")}
          </Button>
          <p className="text-center text-[11px] text-text-muted/70 mt-3">
            {t("demoDisclaimer")}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p>
          <Link href="/reset-password" className="text-gold-pale/80 hover:text-gold-pale transition-colors">
            {t("forgotPassword")}
          </Link>
        </p>
        <p className="text-text-muted">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-gold-pale hover:text-gold-glow transition-colors">
            {t("signUpLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
