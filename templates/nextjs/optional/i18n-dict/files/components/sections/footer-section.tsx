"use client";
import Link from "next/link";
import { SITE_NAME, NAV_LINKS, SOCIAL_LINKS } from "@/constants/common";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useDictionary } from "@/lib/dict-context";

export default function FooterSection() {
  const dict = useDictionary();
  return (
    <footer className="bg-footer text-white">
      <div className="content-container py-16">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <p className="text-2xl font-bold">{SITE_NAME}</p>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              A modern landing page starter kit. Built for developers who ship fast.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.github && (
                <Link
                  href={SOCIAL_LINKS.github}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </Link>
              )}
              {SOCIAL_LINKS.twitter && (
                <Link
                  href={SOCIAL_LINKS.twitter}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {SOCIAL_LINKS.linkedin && (
                <Link
                  href={SOCIAL_LINKS.linkedin}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Legal</p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/50">{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
