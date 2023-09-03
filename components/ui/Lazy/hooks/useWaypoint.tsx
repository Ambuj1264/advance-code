import React, { useState, useCallback } from "react";

import WaypointWrapper from "../WaypointWrapper";

const useWaypoint = ({
  lazyloadOffset,
  disabled = false,
}: {
  lazyloadOffset?: string;
  disabled?: boolean;
}): { WaypointElement: JSX.Element; isPageScrolledDown: boolean } => {
  const [isPageScrolledDown, setIsPageScrolledDown] = useState(disabled);

  const onWaypointEnter = useCallback(() => {
    if (disabled) return;
    setIsPageScrolledDown(false);
  }, [disabled]);
  const onWaypointMountOrLeave = useCallback(() => {
    setIsPageScrolledDown(true);
  }, []);

  return {
    WaypointElement: (
      <WaypointWrapper
        lazyloadOffset={lazyloadOffset}
        onEnter={onWaypointEnter}
        onLeave={onWaypointMountOrLeave}
        onMount={onWaypointMountOrLeave}
      />
    ),
    isPageScrolledDown,
  };
};

export default useWaypoint;
