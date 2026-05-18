"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { StellaraMark } from "@/components/icons/stellara-mark";
import { clearSignOverride } from "@/lib/client/sign-override";

interface NavItem {
  readonly href: string;
  readonly labelKey: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: "\u2606" },
  { href: "/reading", labelKey: "personal", icon: "\u2728" },
  { href: "/tarot", labelKey: "tarot", icon: "\u2660" },
  { href: "/chat", labelKey: "chat", icon: "\u2601" },
  { href: "/history", labelKey: "history", icon: "\u2736" },
  { href: "/settings", labelKey: "settings", icon: "\u2699" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const json = await res.json().catch(() => ({ success: false }));
      if (!json.success) {
        setLoggingOut(false);
        return;
      }
      // Clear any leftover sign override so the next user starts fresh
      clearSignOverride();
      // Hard redirect to clear all client cache and ensure middleware re-evaluates
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 bg-night-deep/70 backdrop-blur-md border-r border-gold-leaf/15 min-h-screen p-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 mb-10 group"
      >
        <StellaraMark size={28} className="text-gold-leaf drop-shadow-[0_0_8px_rgba(255,217,106,0.4)] group-hover:rotate-45 transition-transform duration-700" />
        <h1 className="font-heading text-2xl font-semibold text-gold-pale tracking-wide">
          Stellara
        </h1>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gold-leaf/12 text-gold-pale font-medium border-l-2 border-gold-leaf shadow-[inset_0_0_20px_-8px_rgba(201,169,97,0.3)]"
                  : "text-text-muted hover:text-gold-pale hover:bg-night-veil/50 border-l-2 border-transparent"
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-4 border-t border-text-muted/10">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-base" aria-hidden="true">↪</span>
          {tAuth("logout")}
        </button>
      </div>
    </aside>
  );
}
