import type { ContactFormValues } from "@/components/sections/contact-form-schema";

export async function sendContact(data: ContactFormValues) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Contact API error");
  return res.json();
}
