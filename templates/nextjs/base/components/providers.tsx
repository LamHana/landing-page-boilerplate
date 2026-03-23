"use client";
// __PROVIDERS_IMPORT__

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* __PROVIDERS_WRAP_START__ */}
      {children}
      {/* __PROVIDERS_WRAP_END__ */}
    </>
  );
}
