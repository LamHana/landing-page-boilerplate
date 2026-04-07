"use client";
import { useState } from "react";
import { toast } from "sonner";
import { sendContact } from "@/lib/apis/contact";
import type { ContactFormValues } from "./contact-form-schema";

export function useContactSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      await sendContact(data);
      toast.success("Message sent successfully!");
      return true;
    } catch {
      toast.error("Failed to send. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, onSubmit };
}
