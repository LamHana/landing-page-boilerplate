import type { Locale } from "@/i18n-config";

// Lazy-load dictionary to avoid bundling all locales
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  vi: () => import("@/dictionaries/vi.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
