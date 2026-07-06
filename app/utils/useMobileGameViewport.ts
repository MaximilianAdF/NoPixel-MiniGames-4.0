import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useIsMobileOrTablet } from '@/app/utils/useMediaQuery';

interface UseMobileGameViewportArgs {
  isPlaying: boolean;
  outerRef: RefObject<HTMLElement>;
  wrapperRef: RefObject<HTMLElement>;
  inputRef: RefObject<HTMLInputElement>;
}

export interface MobileGameViewport {
  isMobile: boolean;
  showHint: boolean;
  ensureVisible: (behavior?: ScrollBehavior) => void;
  focusInput: (options?: { force?: boolean }) => void;
  handleInteraction: () => void;
  dismissHint: () => void;
}

// Shared mobile keyboard handling: keeps the puzzle centered above the on-screen keyboard,
// manages the hidden input's focus, and the one-time "tap to play" hint.
export function useMobileGameViewport({
  isPlaying,
  outerRef,
  wrapperRef,
  inputRef,
}: UseMobileGameViewportArgs): MobileGameViewport {
  const isMobile = useIsMobileOrTablet();
  const [showHint, setShowHint] = useState(false);
  const hintDismissedRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const ensureVisible = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      if (!isMobile || typeof window === 'undefined') return;
      const container = outerRef.current ?? wrapperRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const elementCenter = rect.top + scrollTop - viewportHeight / 2 + rect.height / 2;
      window.scrollTo({ top: Math.max(0, elementCenter), behavior });
    },
    [isMobile, outerRef, wrapperRef],
  );

  const scrollSoon = useCallback(() => {
    setTimeout(() => ensureVisible('smooth'), 100);
    setTimeout(() => ensureVisible('smooth'), 300);
    setTimeout(() => ensureVisible('smooth'), 500);
  }, [ensureVisible]);

  const dismissHint = useCallback(() => {
    if (hintDismissedRef.current) return;
    hintDismissedRef.current = true;
    setShowHint(false);
  }, []);

  const focusInput = useCallback(
    (options?: { force?: boolean }) => {
      if (!isMobile) return;
      if (!options?.force && !hasInteractedRef.current) return;
      const input = inputRef.current;
      if (!input) return;
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
      input.setSelectionRange?.(input.value.length, input.value.length);
      // Deliberately NO re-centering here: games re-focus on every keystroke,
      // and scrolling per keypress made the page fight the player. Centering
      // happens once on interaction/round-start/keyboard-open instead.
    },
    [isMobile, inputRef],
  );

  const handleInteraction = useCallback(() => {
    if (!isMobile) return;
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      dismissHint();
    }
    const input = inputRef.current;
    if (!input) return;
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
    requestAnimationFrame(() => {
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
    });
    scrollSoon();
  }, [isMobile, inputRef, dismissHint, scrollSoon]);

  // Center the puzzle shortly after it mounts on mobile.
  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => ensureVisible('smooth'), 200);
    return () => clearTimeout(timer);
  }, [isMobile, ensureVisible]);

  // Re-center and focus the input when a new round starts.
  useEffect(() => {
    if (!isMobile || !isPlaying) return;
    const timer = setTimeout(() => {
      ensureVisible('smooth');
      focusInput({ force: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [isMobile, isPlaying, ensureVisible, focusInput]);

  // Reserve space for the on-screen keyboard and keep the puzzle visible when
  // it opens. Only reacts to real keyboard open/close (resize with a CHANGED
  // offset) — listening to viewport 'scroll' here fed back into our own
  // re-centering scrolls and made the page drift while typing.
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined' || !window.visualViewport) return;
    const viewport = window.visualViewport;
    let lastOffset = -1;
    const handleResize = () => {
      const offset = Math.max(0, window.innerHeight - viewport.height);
      if (Math.abs(offset - lastOffset) < 50) return; // ignore jitter/echoes
      lastOffset = offset;
      document.body.style.paddingBottom = offset ? `${offset}px` : '';
      if (offset > 100) {
        requestAnimationFrame(() => ensureVisible('smooth'));
        setTimeout(() => ensureVisible('smooth'), 300);
      }
    };
    viewport.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      document.body.style.paddingBottom = '';
      viewport.removeEventListener('resize', handleResize);
    };
  }, [isMobile, ensureVisible]);

  // Show the one-time hint while playing on mobile, until the player first interacts.
  useEffect(() => {
    setShowHint(isMobile && isPlaying && !hintDismissedRef.current);
  }, [isMobile, isPlaying]);

  return { isMobile, showHint, ensureVisible, focusInput, handleInteraction, dismissHint };
}
