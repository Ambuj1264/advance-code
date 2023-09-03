import { useState, useEffect } from "react";

const useOnPageLoadWithDelay = (
  options: {
    delay?: number;
    callback?: () => void;
  } = {}
) => {
  const { delay, callback } = options;
  const [canCallEffect, setCanCallEffect] = useState<boolean>(false);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;

    const callCallback = () => {
      setCanCallEffect(true);
      callback?.();
    };

    const pageLoadedCallback = () => {
      if (delay) {
        delayTimer = setTimeout(callCallback, delay);
      } else {
        callCallback();
      }
    };

    if (document.readyState === "complete") {
      callCallback();
      return () => {};
    }

    window.addEventListener("load", pageLoadedCallback);

    return () => {
      window.removeEventListener("load", pageLoadedCallback);
      clearTimeout(delayTimer);
    };
  }, [callback, delay]);

  return canCallEffect;
};

export default useOnPageLoadWithDelay;
