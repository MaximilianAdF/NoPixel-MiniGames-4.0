import {useCallback, useEffect, useRef, useState} from 'react';
import {useInterval} from "@/app/utils/useInterval";

export const useCountdown = (callback: () => void, duration: number, delay: number = 50): [number, () => void, () => void] => {
    const savedCallback = useRef<() => void>();
    const [startTime, setStartTime] = useState<number>();

    const [progress, setProgress] = useState(0);
    const [freeze, setFreeze] = useState(false);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const tick = useCallback(() => {
        if (startTime === undefined || freeze)
            return;
        const elapsed = Date.now() - startTime;
        const p = Math.max(Math.min(elapsed / duration,1), 0) * 100;

        if (p === 100) {
            savedCallback.current?.();
            console.log("finished ticks");
        }
        setProgress(p);
        // console.log(`tick: ${elapsed}ms elapsed, ${p.toFixed(2)}% of ${duration}ms with ${delay}ms delay`);
    }, [duration, freeze, startTime])

    const startCountdown = () => {
        setProgress(0);
        setStartTime(Date.now());
        setFreeze(false);
    }

    const freezeCountdown = () => {
        tick(); // Update to the current exact countdown
        setFreeze(true);
    }

    useInterval(tick, delay, progress === 100);

    useEffect(startCountdown, []);

    return [progress, startCountdown, freezeCountdown];
}
