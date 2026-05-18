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
  { href: "/dashboard", labelKey: "home", icon: "\u2606" },
  { href: "/reading", labelKey: "reading", icon: "\u2728" },
  { href: "/tarot", labelKey: "tarot", icon: "\u2660" },
  { href: "/chat", labelKey: "chat", icon: "\u2601" },
  { href: "/settings", labelKey: "settings", icon: "\u2699" },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-night-deep/85 backdrop-blur-md border-t border-gold-leaf/20 z-50">
      <div className="flex justify-around py-2.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] tracking-wide transition-colors ${
                isActive ? "text-gold-pale" : "text-text-muted hover:text-gold-pale/70"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
