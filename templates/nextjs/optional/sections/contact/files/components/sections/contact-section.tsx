"use client";
import { motion } from "motion/react";
import { ContactForm } from "./contact-form";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-secondary/30 py-24">
      <div className="content-container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">Get in touch</h2>
            <p className="text-lg text-muted-foreground">We&apos;d love to hear from you.</p>
          </div>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
