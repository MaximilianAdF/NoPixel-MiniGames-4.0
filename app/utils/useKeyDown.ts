import { useCallback, useEffect } from 'react';

export const useKeyDown = (callback: (key?: string) => any, keys: string[], enabled: boolean) => {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
