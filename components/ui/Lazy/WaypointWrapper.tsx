import React, { ReactElement, useCallback } from "react";
import { Waypoint } from "react-waypoint";

import useMobileFooterState from "hooks/useMobileFooterState";

const WaypointWrapper = ({
  lazyloadOffset,
  onEnter,
  onLeave,
  onMount,
  horizontal = false,
  scrollableAncestor = "window",
  fireOnRapidScroll = false,
  children,
}: {
  lazyloadOffset?: string;
  onEnter?: ({
    currentPosition,
    previousPosition,
  }: {
    currentPosition?: string;
    previousPosition?: string;
  }) => void;
  onLeave?: ({
    currentPosition,
    previousPosition,
  }: {
    currentPosition?: string;
    previousPosition?: string;
  }) => void;
  onMount?: () => void;
  horizontal?: boolean;
  scrollableAncestor?: any;
  fireOnRapidScroll?: boolean;
  children?: ReactElement;
}) => {
  const onPositionChange = useCallback(
    ({ currentPosition, previousPosition }: Waypoint.CallbackArgs) => {
      if (currentPosition === Waypoint.above && previousPosition === undefined) {
        onMount?.();
      }
    },
    [onMount]
  );

  return (
    <Waypoint
      bottomOffset={lazyloadOffset}
      scrollableAncestor={scrollableAncestor}
      onEnter={onEnter}
      onLeave={onLeave || onEnter}
      onPositionChange={onPositionChange}
      horizontal={horizontal}
      fireOnRapidScroll={fireOnRapidScroll}
    >
      {children}
    </Waypoint>
  );
};

export const WaypointWrapperForMobileFooter = ({ lazyloadOffset }: { lazyloadOffset?: string }) => {
  const { setMobileFooterContextState, isMobileFooterShown } = useMobileFooterState();

  const onWaypointEnter = useCallback(
    ({ previousPosition }: { previousPosition?: string }) => {
      if (previousPosition && isMobileFooterShown) {
        setMobileFooterContextState({ isMobileFooterShown: false });
      }
    },
    [isMobileFooterShown, setMobileFooterContextState]
  );

  const onWaypointMountOrLeave = useCallback(() => {
    if (!isMobileFooterShown) {
      setMobileFooterContextState({ isMobileFooterShown: true });
    }
  }, [isMobileFooterShown, setMobileFooterContextState]);

  return (
    <WaypointWrapper
      lazyloadOffset={lazyloadOffset}
      onEnter={onWaypointEnter}
      onLeave={onWaypointMountOrLeave}
      onMount={onWaypointMountOrLeave}
    />
  );
};

export default WaypointWrapper;
