'use client';

import { useEffect, useState } from 'react';

// Fixed-position sidebar container for Journey's sticky sidebar ad on pages
// with a centered content column (guides, home). Shows only when the right
// gutter fits a 300px unit plus breathing room; the sidebar id/class is what
// Journey's script targets. One instance per page.
const RAIL_WIDTH = 300;
const GUTTER_MARGIN = 40;

export default function SideAdRail({ contentHalfWidth }: { contentHalfWidth: number }) {
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const check = () =>
      setFits(window.innerWidth >= 2 * (contentHalfWidth + RAIL_WIDTH + GUTTER_MARGIN));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [contentHalfWidth]);

  if (!fits) return null;
  return (
    <aside
      id="sidebar"
      aria-label="Sponsored content"
      className="sidebar fixed top-1/2 -translate-y-1/2 z-30 w-[300px] h-[600px] max-h-[70vh] flex items-center justify-center"
      // centered within the right gutter: gutter spans from 50vw+contentHalf
      // to the viewport edge.
      style={{ right: `max(12px, calc(25vw - ${contentHalfWidth / 2 + RAIL_WIDTH / 2}px))` }}
    />
  );
}
