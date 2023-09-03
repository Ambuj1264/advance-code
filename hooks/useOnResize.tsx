import React, { useEffect } from "react";

import { isIOSUserAgent } from "../utils/globalUtils";

import { useDebouncedCallback } from "./useDebounce";

const useOnResize = (
  ref: React.RefObject<HTMLElement | undefined>,
  handler: ResizeObserverCallback
) => {
  useEffect(() => {
    const currentRef = ref?.current;

    if (!currentRef) {
      return;
    }

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(entry => {
        handler(entry, observer);
      });
      observer.observe(currentRef as Element);

      // eslint-disable-next-line consistent-return
      return () => observer.unobserve(currentRef as Element);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handler]);
};

export const useOnIOSWindowResize = (handler: () => void, shouldSkip: boolean) => {
  const isIOS = isIOSUserAgent(window.navigator.userAgent);
  const isVisualViewportSupported = isIOS ? "visualViewport" in window : false;
  const skip = !isVisualViewportSupported || shouldSkip;

  useEffect(() => {
    if (skip) return;

    window?.visualViewport?.addEventListener("resize", handler);

    // eslint-disable-next-line consistent-return
    return () => window?.visualViewport?.removeEventListener("resize", handler);
  }, [skip, handler]);
};

export const useOnWindowResize = (handler: () => void, skip = false) => {
  const resizeHandlerDebounced = useDebouncedCallback(handler, 250);

  useEffect(() => {
    if (skip) return;

    window.addEventListener("resize", resizeHandlerDebounced);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener("resize", resizeHandlerDebounced);
  }, [skip, handler, resizeHandlerDebounced]);
};

export default useOnResize;
