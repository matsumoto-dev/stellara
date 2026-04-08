import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next-intl for client components
vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      if (values) {
        return Object.entries(values).reduce(
          (str, [k, v]) => str.replace(`{${k}}`, String(v)),
          fullKey,
        );
      }
      return fullKey;
    };
  },
  useLocale: () => "en",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl/server for server components
vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      if (values) {
        return Object.entries(values).reduce(
          (str, [k, v]) => str.replace(`{${k}}`, String(v)),
          fullKey,
        );
      }
      return fullKey;
    };
  },
  getLocale: async () => "en",
  getMessages: async () => ({}),
}));
