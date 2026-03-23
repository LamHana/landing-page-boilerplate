"use client";
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/constants/common";
import NavbarMobile from "./navbar-mobile";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./language-switcher";
import { useDictionary } from "@/lib/dict-context";

export default function Navbar() {
  const dict = useDictionary();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm header-shadow">
      <div className="content-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.nav[link.href.slice(1) as keyof typeof dict.nav] ?? link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button className="hidden md:flex">{dict.nav.getStarted}</Button>
          <NavbarMobile />
        </div>
      </div>
    </header>
  );
}
