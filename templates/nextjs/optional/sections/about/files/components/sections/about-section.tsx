"use client";
import { motion } from "motion/react";

// Replace placeholder content with your actual about content
export default function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          {/* Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">About us</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We build products that make a difference. Our team is passionate about creating
              exceptional experiences that delight users and drive results.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Founded in 2024, we have helped hundreds of companies launch successful products with
              our modern approach to design and development.
            </p>
          </div>
          {/* Visual placeholder */}
          <div className="flex h-80 items-center justify-center rounded-2xl bg-accent">
            <span className="text-muted-foreground">Your image here</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
