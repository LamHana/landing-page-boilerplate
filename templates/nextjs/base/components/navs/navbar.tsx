"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/constants/common";
import NavbarMobile from "./navbar-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// __NAVBAR_IMPORT__

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsVisible(true); // scrolling up OR near top → show
      } else {
        setIsVisible(false); // scrolling down → hide
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm header-shadow transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-[calc(100%+20px)]"
      )}
    >
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
