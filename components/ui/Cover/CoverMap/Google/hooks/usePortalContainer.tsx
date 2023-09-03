import { useCallback, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

import useEffectOnce from "hooks/useEffectOnce";

const usePortalContainer = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  const PortalContainer = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (containerRef.current != null) {
        return createPortal(children, containerRef.current);
      }
      return null;
    },
    [containerRef]
  );

  useEffectOnce(function initializePortalContainer() {
    // eslint-disable-next-line functional/immutable-data
    containerRef.current = document.createElement("div");
  });

  return { containerRef, PortalContainer };
};

export default usePortalContainer;
