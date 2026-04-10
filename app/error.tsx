"use client";

import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("error");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-heading text-3xl text-accent">{t("title")}</h1>
      <p className="max-w-md text-text-muted">
        {error.message || t("defaultMessage")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-6 py-3 font-medium text-bg transition-colors hover:bg-accent-light"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
