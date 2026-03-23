import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes safely — use this everywhere instead of string interpolation
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
