import React, { useState, useCallback, ReactNode } from "react";

import WaypointWrapper from "./WaypointWrapper";

export enum LazyloadOffset {
  None = "0px",
  Tiny = "-100px",
  Small = "-400px",
  Medium = "-800px",
}

const LazyComponent = ({
  children,
  loadingElement,
  lazyloadOffset = LazyloadOffset.Small,
  scrollableAncestor,
}: {
  children: ReactNode | JSX.Element | JSX.Element[];
  loadingElement?: ReactNode;
  lazyloadOffset?: LazyloadOffset;
  scrollableAncestor?: any;
}) => {
  const [visible, setVisible] = useState(false);

  const onWaypointMountOrEnter = useCallback(() => setVisible(true), [setVisible]);

  return (
    <>
      <WaypointWrapper
        lazyloadOffset={lazyloadOffset}
        onEnter={onWaypointMountOrEnter}
        onMount={onWaypointMountOrEnter}
        scrollableAncestor={scrollableAncestor}
      />
      {!visible && loadingElement}
      {visible && children}
    </>
  );
};

export default LazyComponent;
