import { useMemo, useRef } from "react";

import useVerticalScrollPosition from "./useVerticalScrollPosition";

export const BOOKING_WIDGET_MARGIN = 95;

const useBWScroll = () => {
  const bookingWidgetRef = useRef<HTMLDivElement>(null);

  const elDistanceToTop = useVerticalScrollPosition();

  const hasReachedHeader = useMemo(
    () => elDistanceToTop >= BOOKING_WIDGET_MARGIN,
    [elDistanceToTop]
  );

  return {
    bookingWidgetRef,
    elDistanceToTop,
    hasReachedHeader,
  };
};

export default useBWScroll;
