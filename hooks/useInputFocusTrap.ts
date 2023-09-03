import { useEffect, useRef } from "react";

const useInputFocusTrap = ({ condition = true, timeout = 500, didMountOnly = true }) => {
  const ref = useRef<HTMLInputElement>(null);
  const deps = didMountOnly ? [] : [condition];

  useEffect(() => {
    if (condition) setTimeout(() => ref.current?.focus(), timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};

export default useInputFocusTrap;
