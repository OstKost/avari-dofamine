"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackGoal } from "@/lib/analytics/tracker";

export function WebVitalsTracker() {
  useReportWebVitals((metric) => {
    // Send Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
    try {
      trackGoal(`web_vital_${metric.name.toLowerCase()}`, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        id: metric.id,
      });
    } catch {
      // ignore
    }
  });

  return null;
}
