import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/components/sections/contact-form-schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // TODO: connect your email service (Resend recommended)
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: process.env.RESEND_FROM_EMAIL!,
  //   to:   process.env.RESEND_TO_EMAIL!,
  //   subject: `New contact from ${parsed.data.name}`,
  //   text: `Phone: ${parsed.data.phone}\nEmail: ${parsed.data.email}\nMessage: ${parsed.data.message ?? ""}`,
  // });

  console.log("Contact submission:", parsed.data);
  return NextResponse.json({ ok: true });
}
