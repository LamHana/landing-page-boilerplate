"use client";
import { motion } from "motion/react";
import { Zap, Shield, Palette, Globe, Code, Rocket } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Built on Next.js 15 with Turbopack. Dev server starts in milliseconds.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    description: "Best-practice security headers, no inline scripts, CSP-ready.",
  },
  {
    icon: Palette,
    title: "Fully themeable",
    description: "5 beautiful presets. One CSS file to rebrand completely.",
  },
  {
    icon: Globe,
    title: "i18n ready",
    description: "Optional dictionary-based translation. Zero extra dependencies.",
  },
  {
    icon: Code,
    title: "Clean code",
    description: "TypeScript, ESLint, component-first architecture. Easy to extend.",
  },
  {
    icon: Rocket,
    title: "Deploy anywhere",
    description: "Docker-ready standalone output. Ships to any VPS in minutes.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary/30 py-24">
      <div className="content-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="text-4xl font-bold">Everything you need</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built with the best tools in the ecosystem. No bloat, just what matters.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
