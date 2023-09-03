/* eslint-disable functional/immutable-data */
import { useEffect, useState } from "react";

const setUpLayout = (visibility: string, axis?: string) => {
  switch (axis) {
    case "x":
      document.documentElement.style.overflowX = visibility;
      break;
    case "y":
      document.documentElement.style.overflowY = visibility;
      break;
    default:
      document.documentElement.style.overflow = visibility;
      break;
  }
};

const useHTMLScrollLock = (isScrollable?: boolean, axis?: string) => {
  const [scrollPosition] = useState(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    if (isScrollable) {
      return () => {};
    }

    setUpLayout("hidden", axis);

    return () => {
      setUpLayout("visible", axis);
      window.requestAnimationFrame(() => window.scrollTo({ top: scrollPosition }));
    };
  }, [isScrollable, axis, scrollPosition]);
};

export default useHTMLScrollLock;
