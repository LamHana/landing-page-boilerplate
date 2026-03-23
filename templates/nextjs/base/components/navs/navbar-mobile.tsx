"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Slide-down mobile menu */}
      <div
        className={cn(
          "absolute inset-x-0 top-16 flex flex-col gap-4 border-b bg-background p-6 transition-all duration-200",
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
          >
            {link.label}
          </Link>
        ))}
        <Button className="w-full">Get started</Button>
      </div>
    </div>
  );
}
