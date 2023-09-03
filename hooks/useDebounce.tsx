import { useState, useEffect, useRef, useCallback } from "react";

export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  wait: number,
  persist?: boolean
) {
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => cleanup, []);

  const debouncedCallback = useCallback(
    (...args: A) => {
      // eslint-disable-next-line functional/immutable-data
      argsRef.current = args;
      if (persist) args[0].persist();
      cleanup();

      // eslint-disable-next-line functional/immutable-data
      timeout.current = setTimeout(() => {
        if (argsRef.current) {
          callback(...argsRef.current);
        }
      }, wait);
    },
    [callback, persist, wait]
  );

  return debouncedCallback;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
