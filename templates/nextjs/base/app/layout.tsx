import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";
// __PROVIDERS_IMPORT__

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = createMetadata({
  title: "__PROJECT_NAME__",
  description: "A modern landing page",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {/* __PROVIDERS_WRAP_START__ */}
          {children}
          {/* __PROVIDERS_WRAP_END__ */}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
