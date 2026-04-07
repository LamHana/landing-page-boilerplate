"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { contactFormSchema, type ContactFormValues, DEFAULT_VALUES } from "./contact-form-schema";
import { useContactSubmit } from "./use-contact-submit";

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const { isSubmitting, onSubmit } = useContactSubmit();

  async function handleSubmit(data: ContactFormValues) {
    const ok = await onSubmit(data);
    if (ok) form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <input {...field} placeholder="Your name"
                className="h-12 w-full rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone *</FormLabel>
            <FormControl>
              <input {...field} type="tel" placeholder="+84 xxx xxx xxx"
                className="h-12 w-full rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <input {...field} type="email" placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <textarea {...field} rows={4} placeholder="How can we help?"
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
