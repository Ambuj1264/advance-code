import { useRef, useEffect } from "react";

const useOnMount = (cb: () => void, deps?: React.DependencyList, shouldSkipOnMount?: boolean) => {
  const mounted = useRef<boolean>(false);
  useEffect(() => {
    if (mounted.current || shouldSkipOnMount) return;

    if (!mounted.current) {
      cb();
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? []);
};

export default useOnMount;
