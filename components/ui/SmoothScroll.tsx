/* eslint-disable functional/immutable-data */
import React, { useCallback } from "react";
import { Waypoint } from "react-waypoint";

const SmoothScroll = () => {
  const onEnter = useCallback(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  const onLeave = useCallback(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);
  return <Waypoint scrollableAncestor="window" onEnter={onEnter} onLeave={onLeave} />;
};

export default SmoothScroll;
