import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

// Analytics component — enabled via environment variables.
// Set NEXT_PUBLIC_GTM_ID and/or NEXT_PUBLIC_GA_ID in .env to activate.
// Sentry: install @sentry/nextjs and follow their wizard for full setup.
export function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
