"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { NAV_LINKS, SITE_NAME } from "@/constants/common";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

export default function NavbarMobile() {
  return (
    <div className="md:hidden">
      <Sheet>
        {/* Hamburger trigger */}
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent>
          {/* Header: logo + close button */}
          <SheetHeader className="flex-row items-center justify-between">
            <SheetTitle className="text-base font-bold text-primary not-sr-only">
              {SITE_NAME}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>

          {/* Nav links — staggered fade-in */}
          <nav className="flex flex-1 flex-col gap-1 px-2">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.25 }}
              >
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </motion.div>
            ))}
          </nav>

          {/* CTA */}
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full">Get started</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
