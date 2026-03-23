"use client";
import { DictProvider } from "@/lib/dict-context";
import type en from "@/dictionaries/en.json";

type Dictionary = typeof en;

export default function Providers({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict?: Dictionary;
}) {
  const content = <>{children}</>;
  return dict ? <DictProvider dict={dict}>{content}</DictProvider> : content;
}
