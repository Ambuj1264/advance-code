import { useRef, useEffect } from "react";

const useOnDidUpdate = (
  cb: () => void,
  deps: React.DependencyList,
  shouldSkipDidUpdate = false
) => {
  const mounted = useRef<boolean>();
  useEffect(() => {
    if (shouldSkipDidUpdate) return;

    if (!mounted.current) {
      mounted.current = true;
    } else {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useOnDidUpdate;
