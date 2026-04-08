"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("nav");

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 bg-bg-card border-r border-text-muted/10 min-h-screen p-4">
      <Link href="/" className="block mb-8">
        <h1 className="font-heading text-2xl font-bold text-accent">Stellara</h1>
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-muted hover:text-text hover:bg-bg-card"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
