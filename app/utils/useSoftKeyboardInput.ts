import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

// The hidden field is kept padded with filler and read as a positional diff
// rather than being cleared after every keystroke. Two Android behaviours make
// the naive "read value, reset to ''" approach drop input on some keyboards:
// an empty field has nothing to delete, so Backspace emits no event at all,
// and rewriting value mid-composition invalidates the IME's composing region,
// after which it stops emitting until the field is re-focused.
const FILLER = 'x';
const BUFFER_LENGTH = 24;
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;
// A real Backspace deletes one character per event; anything larger is an IME
// rewriting the buffer, and replaying it as deletes would eat the player's guess.
const MAX_DELETES_PER_EVENT = 4;

interface InputDiff {
  removed: number;
  inserted: string;
}

// Longest common prefix/suffix diff — the only reliable way to read an IME that
// may replace a span rather than append a character. Exported for testing.
export function diffValue(prev: string, next: string): InputDiff {
  const max = Math.min(prev.length, next.length);
  let start = 0;
  while (start < max && prev[start] === next[start]) start += 1;
  let end = 0;
  while (end < max - start && prev[prev.length - 1 - end] === next[next.length - 1 - end]) end += 1;
  return { removed: prev.length - start - end, inserted: next.slice(start, next.length - end) };
}

interface UseSoftKeyboardInputArgs {
  // Mount/arm the field — typically `isMobile && phase === 'playing'`.
  enabled: boolean;
  inputRef: RefObject<HTMLInputElement>;
  // Receives 'Backspace', 'Enter', or a single accepted character.
  onKey: (key: string) => void;
  // Filter for inserted characters, applied before onKey. Return the character
  // to submit (allows normalising case) or null to drop it.
  accept: (char: string) => string | null;
}

export interface SoftKeyboardInput {
  // Spread onto the hidden input. The caller still owns `ref` and styling.
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  // False while the keyboard is dismissed, so the game can prompt to tap.
  isFocused: boolean;
  focus: () => void;
}

// Bridges an on-screen keyboard to a game that consumes single keys, via a
// hidden input that stays padded so every IME has something to act on.
export function useSoftKeyboardInput({
  enabled,
  inputRef,
  onKey,
  accept,
}: UseSoftKeyboardInputArgs): SoftKeyboardInput {
  const [isFocused, setIsFocused] = useState(false);
  const lastValueRef = useRef('');
  const composingRef = useRef(false);
  const onKeyRef = useRef(onKey);
  const acceptRef = useRef(accept);

  useEffect(() => {
    onKeyRef.current = onKey;
    acceptRef.current = accept;
  }, [onKey, accept]);

  const refill = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const value = FILLER.repeat(BUFFER_LENGTH);
    input.value = value;
    lastValueRef.current = value;
    try {
      input.setSelectionRange(value.length, value.length);
    } catch {
      // Selection is unsupported on some input types; the diff copes without it.
    }
  }, [inputRef]);

  const focus = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
  }, [inputRef]);

  // Arm the buffer as soon as the field mounts so the first keystroke — which
  // may be a Backspace — already has filler to consume.
  useEffect(() => {
    if (enabled) refill();
  }, [enabled, refill]);

  const read = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const next = input.value;
    const { removed, inserted } = diffValue(lastValueRef.current, next);
    lastValueRef.current = next;

    if (inserted) {
      for (const char of inserted) {
        // Numeric keypads expose Enter as a Go/Done key that inserts a newline
        // instead of raising a keydown on some Android keyboards.
        if (char === '\n' || char === '\r') {
          onKeyRef.current('Enter');
          continue;
        }
        const key = acceptRef.current(char);
        if (key) onKeyRef.current(key);
      }
    } else if (removed > 0) {
      const deletes = Math.min(removed, MAX_DELETES_PER_EVENT);
      for (let i = 0; i < deletes; i += 1) onKeyRef.current('Backspace');
    }

    // Never resize the field mid-composition; that is what desyncs the IME.
    if (composingRef.current) return;
    if (next.length < MIN_LENGTH || next.length > MAX_LENGTH) refill();
  }, [inputRef, refill]);

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    // type="text" + inputMode is better supported across Android keyboards than
    // type="tel", which opens a dialpad IME with its own quirks.
    type: 'text',
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: false,
    onInput: read,
    onCompositionStart: () => {
      composingRef.current = true;
    },
    onCompositionEnd: () => {
      composingRef.current = false;
      read();
    },
    onKeyDown: (e) => {
      // Enter is the one key that leaves the value untouched on a hardware
      // keyboard, so the diff cannot see it. Everything else routes through read().
      if (e.key === 'Enter') {
        e.preventDefault();
        onKeyRef.current('Enter');
      }
    },
    onFocus: () => {
      setIsFocused(true);
      refill();
    },
    onBlur: () => setIsFocused(false),
  };

  return { inputProps, isFocused, focus };
}
