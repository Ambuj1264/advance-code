/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from "react";

import { isIOSUserAgent } from "../utils/globalUtils";
import { isTouchDevice } from "../utils/helperUtils";

import { useOnIOSWindowResize, useOnWindowResize } from "./useOnResize";
import { useIsMobile } from "./useMediaQueryCustom";

import { useGlobalContext } from "contexts/GlobalContext";

const useOnSoftKeyboardStateChange = () => {
  if (typeof window === "undefined") return;

  const { setContextState: setGlobalContextState } = useGlobalContext();
  const fullWindowHeight = document.documentElement.clientHeight;
  const scale = "visualViewport" in window ? window.visualViewport.scale : 1;
  const isMobile = useIsMobile();
  const touchDevice = isTouchDevice();
  const isDesktop = !isMobile || !touchDevice;

  const handleResize = useCallback(
    (visibleHeight: number) => {
      // assuming that if more than 200 px of the screen is not used by browser viewport, means keyboard is open
      if (fullWindowHeight - visibleHeight >= 200) {
        setGlobalContextState({ isMobileKeyboardOpen: true });
      } else {
        setGlobalContextState({ isMobileKeyboardOpen: false });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const androidSoftKeyboardHandler = useCallback(
    () => {
      const visibleHeight = document.documentElement.clientHeight * scale;
      handleResize(visibleHeight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const iOSSoftKeyboardHandler = useCallback(() => {
    const visibleHeight = window.visualViewport.height * scale;
    handleResize(visibleHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useOnWindowResize(
    androidSoftKeyboardHandler,
    isDesktop || isIOSUserAgent(window.navigator.userAgent)
  );
  useOnIOSWindowResize(iOSSoftKeyboardHandler, isDesktop);
};

export default useOnSoftKeyboardStateChange;
