'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

/**
 * Global loading component with continuous lockpick puzzle animation
 * Shows during navigation and hides when page is fully loaded
 * Optimized with CSS animations for smooth 60fps performance
 */
export default function GlobalLoading() {
  const pathname = usePathname();
  const { isPageLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isPageLoading) {
      // Show loading immediately
      setShouldRender(true);
      // Slight delay to allow fade-in animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Fade out first
      setIsVisible(false);
      // Then remove from DOM after animation completes
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [isPageLoading]);

  // Don't render at all if not needed
  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0F1B21]/60 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Simple rotating lockpick ring - optimized for performance */}
      <div className="relative w-16 h-16">
        {/* Outer ring with 4 slots */}
        <div className="absolute inset-0 rounded-full border-2 border-[#54FFA4]/20" />
        
        {/* Rotating balls - using CSS animation for better performance */}
        <div className="absolute inset-0 animate-spin-smooth">
          {[0, 90, 180, 270].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-2 rounded-full bg-[#54FFA4]"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-28px)`,
                boxShadow: '0 0 8px rgba(84, 255, 164, 0.6)',
              }}
            />
          ))}
        </div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#54FFA4] border-2 border-[#0F1B21]" />
      </div>
    </div>
  );
}
