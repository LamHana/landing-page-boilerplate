"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navs/navbar";

// Hero section — the first thing users see
// Replace headline, subtext, and CTA content with your actual copy
export default function HeroSection() {
  return (
    <>
      <Navbar />
      <section
        id="hero"
        className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden py-24"
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, var(--brand-surface) 0%, transparent 70%)",
          }}
        />

        <div className="content-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl space-y-8 text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              New — v1.0 just shipped
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Build faster,{" "}
              <span className="text-gradient-brand">ship better</span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              The modern landing page starter for your next project. Production-ready, beautifully
              designed, fully customizable.
            </p>

            {/* CTAs */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="btn-primary px-8 text-white">
                Get started free
              </Button>
              <Button size="lg" variant="outline" className="btn-outline px-8">
                View documentation
              </Button>
            </div>

            {/* Social proof */}
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">500+</span> developers
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
