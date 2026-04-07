import { z } from "zod";

export const contactFormSchema = z.object({
  name:    z.string().trim().min(1, "Name is required").max(100),
  phone:   z.string().trim().regex(/^\+?[\d\s\-().]{7,20}$/, "Invalid phone number"),
  email:   z.string().trim().email("Invalid email address"),
  message: z.string().trim().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const DEFAULT_VALUES: ContactFormValues = {
  name: "", phone: "", email: "", message: "",
};
