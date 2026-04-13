import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_SECONDS = 59 * 60; // 59:00 hard cap

export function useTimer(
    initialDuration: number,
    resetKey: any,          // changes only when we want a real reset (e.g. task switch)
    onEnd: () => void
) {
    const [timeRemaining, setTimeRemaining] = useState(Math.min(initialDuration, MAX_SECONDS));
    const [isRunning, setIsRunning] = useState(false);
    const endTimeRef = useRef<number | null>(null);

    // Reset ONLY when resetKey changes, not when duration is synced back from App
    useEffect(() => {
        setTimeRemaining(Math.min(initialDuration, MAX_SECONDS));
        setIsRunning(false);
        endTimeRef.current = null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    useEffect(() => {
        let intervalId: any;

        if (isRunning) {
            if (!endTimeRef.current) {
                endTimeRef.current = Date.now() + timeRemaining * 1000;
            }

            intervalId = setInterval(() => {
                const now = Date.now();
                const remaining = Math.round((endTimeRef.current! - now) / 1000);

                if (remaining <= 0) {
                    setTimeRemaining(0);
                    setIsRunning(false);
                    endTimeRef.current = null;
                    onEnd();
                } else {
                    setTimeRemaining(remaining);
                }
            }, 100);
        } else {
            endTimeRef.current = null;
        }

        return () => clearInterval(intervalId);
    }, [isRunning, onEnd, timeRemaining]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);

    const addMinute = useCallback(() => {
        setTimeRemaining(t => {
            const newT = Math.min(t + 60, MAX_SECONDS);
            if (isRunning && endTimeRef.current) {
                endTimeRef.current = Date.now() + newT * 1000;
            }
            return newT;
        });
    }, [isRunning]);

    const subtractMinute = useCallback(() => {
        setTimeRemaining(t => {
            const newT = Math.max(t - 60, 0);
            if (isRunning && endTimeRef.current) {
                endTimeRef.current = Date.now() + newT * 1000;
            }
            return newT;
        });
    }, [isRunning]);

    const reset = useCallback((dur: number) => {
        setIsRunning(false);
        endTimeRef.current = null;
        setTimeRemaining(Math.min(dur, MAX_SECONDS));
    }, []);

    return { timeRemaining, isRunning, start, pause, addMinute, subtractMinute, reset };
}
