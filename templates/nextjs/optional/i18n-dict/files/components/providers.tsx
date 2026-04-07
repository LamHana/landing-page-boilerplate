"use client";
import { DictProvider } from "@/lib/dict-context";
import type en from "@/dictionaries/en.json";
// __PROVIDERS_IMPORT__

type Dictionary = typeof en;

export default function Providers({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict?: Dictionary;
}) {
  // __PROVIDERS_INIT__
  const content = (
    <>
      {/* __PROVIDERS_WRAP_START__ */}
      {children}
      {/* __PROVIDERS_WRAP_END__ */}
    </>
  );
  return dict ? <DictProvider dict={dict}>{content}</DictProvider> : content;
}
