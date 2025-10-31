"use client";

import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function AppAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
