import React, { useEffect } from "react";

const useOnClick = (
  ref: React.RefObject<HTMLDivElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const currentRef = ref?.current;

    if (!currentRef) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      if (currentRef.contains(event.target as Node)) {
        handler(event);
      }
    };

    currentRef.addEventListener("click", listener);

    // eslint-disable-next-line consistent-return
    return () => {
      currentRef.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useOnClick;
