import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "@/i18n-config";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  // Filter out wildcard "*" — Intl.getCanonicalLocales throws on it
  const languages = new Negotiator({ headers: negotiatorHeaders })
    .languages()
    .filter((lang) => lang !== "*");
  return matchLocale(languages, [...i18n.locales], i18n.defaultLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    // Forward detected locale to the root layout via response header
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.headers.set("x-locale", locale);
    return response;
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
