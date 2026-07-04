'use client';

import { useEffect, useRef, useState } from 'react';

// Sidebar container in the game pages' right gutter for Journey's sticky
// sidebar ad unit (their script targets a recognizable sidebar element — the
// site had none, so the unit never served). Renders only when the gutter
// column is wide enough for a 300px unit plus breathing room; otherwise the
// column stays empty and the game remains centered.
const MIN_COLUMN_WIDTH = 340;

export default function GameAdRail() {
  const columnRef = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    const check = () => setFits(el.getBoundingClientRect().width >= MIN_COLUMN_WIDTH);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={columnRef} className="h-full min-w-0 hidden lg:flex items-center justify-center">
      {fits && (
        <aside
          id="sidebar"
          // Height adapts to the column (banner clearance already excluded),
          // capped at the 300x600 unit; short screens leave room for 300x250.
          className="sidebar w-[300px] h-full max-h-[600px] flex items-center justify-center"
          aria-label="Sponsored content"
        />
      )}
    </div>
  );
}
