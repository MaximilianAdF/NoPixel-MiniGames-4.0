// Based on https://medium.com/@paulohfev/problem-solving-custom-react-hook-for-keydown-events-e68c8b0a371

import {useCallback, useEffect} from 'react';

export const useKeyDown = (callback: (key?: string) => any, keys: string[]) => {
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const anyKeyPressed = keys.some((key) => event.key === key);

    if (anyKeyPressed) {
      event.preventDefault();
      callback(event.key);
    }
  }, [callback, keys]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};
