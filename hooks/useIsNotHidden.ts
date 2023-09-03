import { RefObject, useEffect, useRef, useState } from "react";

const useIsNotHidden = <T extends HTMLElement>(): [boolean, RefObject<T>] => {
  const onScreenRef = useRef<T>(null);
  const [isOnScreen, setIsOnScreen] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isOnSafari = userAgent.includes("safari") && !userAgent.includes("chrome");

    const timeout = setTimeout(
      () => setIsOnScreen(onScreenRef.current?.offsetParent !== null),
      isOnSafari ? 100 : 1
    );

    return () => clearTimeout(timeout);
  }, []);

  return [isOnScreen, onScreenRef];
};

export default useIsNotHidden;
