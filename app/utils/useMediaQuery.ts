import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize to false to ensure server and first client render match
  // This prevents hydration mismatches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Update to actual value after mount (won't cause hydration error)
    setMatches(media.matches);
    
    // Create listener for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      // @ts-ignore
      media.addListener(listener);
    }
    
    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // @ts-ignore
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Detect if device is mobile (max-width: 768px)
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');

/**
 * Detect if device is tablet (769px - 1024px)
 */
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

/**
 * Detect if device is desktop (min-width: 1025px)
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');

/**
 * Detect if device is mobile or tablet (max-width: 1024px)
 */
export const useIsMobileOrTablet = () => useMediaQuery('(max-width: 1024px)');

/**
 * Detect touch capability
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - legacy property
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
  }, []);

  return isTouch;
};

/**
 * Detect device orientation
 */
export const useOrientation = (): 'portrait' | 'landscape' => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return orientation;
};
