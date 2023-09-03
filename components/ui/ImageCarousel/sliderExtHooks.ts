import { useCallback, useEffect, useRef } from "react";

import useToggle from "hooks/useToggle";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";

export const useOnSliderInteracted = () => {
  const [isInteracted, , setIsInteracted] = useToggle(false);
  const onGalleryInteraction = useCallback(
    () => !isInteracted && setIsInteracted(),
    [isInteracted, setIsInteracted]
  );
  const slickInstance = useRef<ReactSlickInner>(null);

  useEffectOnScrollMobile(onGalleryInteraction);

  useEffect(() => {
    if (isInteracted && slickInstance.current) {
      slickInstance.current.lazyLoadTimer = setInterval(
        slickInstance.current.progressiveLazyLoad,
        1000
      );
    }
  }, [isInteracted]);

  return { onGalleryInteraction, slickInstance };
};
