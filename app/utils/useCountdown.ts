import { useCallback, useEffect, useRef, useState } from "react";
import { timerBeepPlayer } from "@/public/audio/AudioManager";

export const useCountdown = (
  callback: () => void,
  setElapsed: (elapsed: number) => void,
  duration: number
): [number, () => void, () => void] => {
  const savedCallback = useRef<() => void>();
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const freezeRef = useRef(true);
  const [iteration, setIteration] = useState(0);
  const lastBeepSecondRef = useRef(0);

  const cleanupRunners = useCallback(() => {
    if (typeof window === "undefined") return;

    if (animationFrameRef.current !== undefined) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const updateProgress = useCallback((value: number) => {
    const clamped = Math.max(Math.min(value, 100), 0);
    setProgress(clamped);
  }, []);

  useEffect(() => {
    timerBeepPlayer.whenReady();
  }, []);

  const step = useCallback(
    (time: number) => {
      if (startTimeRef.current === undefined) {
        return true;
      }

      const elapsed = time - startTimeRef.current;
      setElapsed(elapsed);

      const secondsElapsed = Math.floor(elapsed / 1000);
      if (secondsElapsed > lastBeepSecondRef.current) {
        lastBeepSecondRef.current = secondsElapsed;
        timerBeepPlayer.play();
      }

      const percent = duration <= 0 ? 100 : (elapsed / duration) * 100;
      updateProgress(percent);

      if (percent >= 100) {
        freezeRef.current = true;
        savedCallback.current?.();
        return true;
      }

      return false;
    },
    [duration, setElapsed, updateProgress]
  );

  const startCountdown = useCallback(() => {
    if (typeof window === "undefined") return;

    cleanupRunners();
    freezeRef.current = false;
    updateProgress(0);
    setElapsed(0);
    lastBeepSecondRef.current = 0;
    startTimeRef.current = window.performance?.now() ?? Date.now();
    setIteration((prev) => prev + 1);
  }, [cleanupRunners, setElapsed, updateProgress]);

  const freezeCountdown = useCallback(() => {
    if (typeof window === "undefined") return;

    freezeRef.current = true;
    cleanupRunners();
    const now = window.performance?.now() ?? Date.now();
    step(now);
  }, [cleanupRunners, step]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (startTimeRef.current === undefined || freezeRef.current) return;

    const animate = (time: number) => {
      const finished = step(time);
      if (!finished && !freezeRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== undefined) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [step, iteration]);

  useEffect(() => {
    startCountdown();
    return cleanupRunners;
  }, [cleanupRunners, startCountdown]);

  return [progress, startCountdown, freezeCountdown];
};
