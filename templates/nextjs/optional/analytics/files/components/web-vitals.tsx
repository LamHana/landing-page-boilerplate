"use client";
import { useReportWebVitals } from "next/web-vitals";

// Reports Core Web Vitals to the console (development) or your analytics endpoint.
// Replace the console.log with your analytics send call in production.
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(metric);
    }
    // Example: send to GA4
    // gtag("event", metric.name, { value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value), ... });
  });

  return null;
}
