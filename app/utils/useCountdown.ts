import { useCallback, useEffect, useRef, useState } from 'react';
import { timerBeepPlayer } from "@/public/audio/AudioManager";
import { useInterval } from "@/app/utils/useInterval";

export const useCountdown = (callback: () => void, setElapsed: (elapsed: number) => void, duration: number, delay: number = 50): [number, () => void, () => void] => {
    const savedCallback = useRef<() => void>();
    const [startTime, setStartTime] = useState<number>();
    const [progress, setProgress] = useState(0);
    const [freeze, setFreeze] = useState(false);
    const lastBeepTime = useRef<number>(0);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const tick = useCallback(() => {
        if (startTime === undefined || freeze) return;

        // Calculate the progress
        const now = Date.now();
        const elapsed = now - startTime;
        const p = Math.max(Math.min(elapsed / duration, 1), 0) * 100;
        setElapsed(elapsed);

        // Play audio every second
        if (elapsed - lastBeepTime.current >= 1000) {
            timerBeepPlayer.play();
            lastBeepTime.current = elapsed;
        }

        if (p === 100) {
            savedCallback.current?.();
            console.log("finished ticks");
        }
        setProgress(p);
    }, [duration, freeze, startTime, setElapsed]);

    const startCountdown = () => {
        setProgress(0);
        setElapsed(0); // Initialize elapsed time
        setStartTime(Date.now());
        setFreeze(false);
        lastBeepTime.current = 0;
    };

    const freezeCountdown = () => {
        tick(); // Update to the current exact countdown
        setFreeze(true);
    };

    useInterval(tick, delay, progress === 100);

    useEffect(startCountdown, []);

    return [progress, startCountdown, freezeCountdown];
};
