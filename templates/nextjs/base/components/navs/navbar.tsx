import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/constants/common";
import NavbarMobile from "./navbar-mobile";
import { Button } from "@/components/ui/button";
// __NAVBAR_IMPORT__

// Server component — no animation needed at nav level
export default function Navbar() {
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
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* __NAVBAR_EXTRAS__ */}
          <Button className="hidden md:flex">Get started</Button>
          <NavbarMobile />
        </div>
      </div>
    </header>
  );
}
