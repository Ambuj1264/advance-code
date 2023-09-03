import { useState, useEffect } from "react";

import { isBrowser } from "utils/helperUtils";

const getScrollPositionY = () => (isBrowser ? window.pageYOffset : 0);

const useVerticalScrollPosition = () => {
  const [scrollY, setScrollY] = useState(getScrollPositionY());

  useEffect(() => {
    const callBack = () => setScrollY(getScrollPositionY());
    window.addEventListener("scroll", callBack);

    return () => window.removeEventListener("scroll", callBack);
  }, []);

  return scrollY;
};

export default useVerticalScrollPosition;
