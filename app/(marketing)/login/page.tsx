"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      router.push("/dashboard");
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="font-heading text-3xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input id="email" name="email" type="email" label={t("email")} required />
        <Input id="password" name="password" type="password" label={t("password")} required />
        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {t("submit")}
        </Button>
      </form>

      <div className="w-full max-w-sm mt-6">
          <div className="relative flex items-center gap-3">
            <hr className="flex-1 border-border" />
            <span className="text-xs text-text-muted shrink-0">{t("demoSeparator")}</span>
            <hr className="flex-1 border-border" />
          </div>
          <div className="mt-4 space-y-2">
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
            <p className="text-center text-xs text-text-muted">
              {t("demoDisclaimer")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-center text-sm">
        <p>
          <Link href="/reset-password" className="text-accent hover:underline">
            {t("forgotPassword")}
          </Link>
        </p>
        <p className="text-text-muted">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-accent hover:underline">
            {t("signUpLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
