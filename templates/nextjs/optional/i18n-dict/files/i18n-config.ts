export const i18n = {
  defaultLocale: "en",
  locales: ["en", "vi"], // extend with your locales
} as const;

export type Locale = (typeof i18n)["locales"][number];
