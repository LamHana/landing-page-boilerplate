"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
};

// Build the same page URL but with a different locale prefix
function buildLocalePath(pathname: string, targetLocale: Locale, currentLocale: string): string {
  if (pathname === `/${currentLocale}`) return `/${targetLocale}`;
  return pathname.replace(`/${currentLocale}/`, `/${targetLocale}/`);
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.lang as Locale) ?? i18n.defaultLocale;

  return (
    <div className="hidden items-center gap-1 rounded-md border border-border p-0.5 md:flex">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={buildLocalePath(pathname, locale as Locale, currentLocale)}
          className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
            currentLocale === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LOCALE_LABELS[locale as Locale] ?? locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
