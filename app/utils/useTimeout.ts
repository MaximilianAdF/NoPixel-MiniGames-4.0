// Based on useInterval.ts

import {useCallback, useEffect, useRef} from 'react';
import {start} from "node:repl";


const useTimeout = (callback: () => void, delay?: number | undefined) => {
    const savedCallback = useRef<() => void>();
    const id = useRef<NodeJS.Timeout>();

    const startTimeout = useCallback(() => {
        function tick() {
            savedCallback.current?.();
        }

        clearTimeout(id.current);
        id.current = setTimeout(tick, delay)

        return () => clearTimeout(id.current);
    }, [delay])

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the timeout.
    // useEffect(() => {
    //     startTimeout();
    //     return () => clearTimeout(id.current);
    // }, [startTimeout]);

    return startTimeout;
}


export default useTimeout;
