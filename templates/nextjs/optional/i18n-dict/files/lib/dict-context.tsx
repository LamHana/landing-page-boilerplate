"use client";
import { createContext, useContext } from "react";
import defaultDict from "@/dictionaries/en.json";
import type en from "@/dictionaries/en.json";

type Dictionary = typeof en;

const DictContext = createContext<Dictionary | null>(null);

export function DictProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return <DictContext.Provider value={dict}>{children}</DictContext.Provider>;
}

// Falls back to English if no provider in tree
export function useDictionary(): Dictionary {
  return useContext(DictContext) ?? defaultDict;
}
