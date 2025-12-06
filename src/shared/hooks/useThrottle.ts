import { useRef } from "react";

/**
 * Custom hook to throttle a function.
 * @param callback Function to execute
 * @param delay Delay in ms between executions
 */
export function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const lastCall = useRef(0);

  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }) as T;
}
