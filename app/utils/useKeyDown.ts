import { useCallback, useEffect } from 'react';

export const useKeyDown = (callback: (key?: string) => any, keys: string[], enabled: boolean) => {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Never swallow keys aimed at a text field. The mobile games focus a hidden
      // input and read the keystrokes back off its value, so calling
      // preventDefault() here stopped the character from ever being inserted —
      // on any keyboard that reports a real event.key rather than Android's
      // composing-IME placeholder.
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const anyKeyPressed = keys.some((key) => event.key === key);

      if (anyKeyPressed) {
        event.preventDefault();
        callback(event.key);
      }
    },
    [callback, keys]
  );

  useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (enabled) {
        onKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [enabled, onKeyDown]);
};
