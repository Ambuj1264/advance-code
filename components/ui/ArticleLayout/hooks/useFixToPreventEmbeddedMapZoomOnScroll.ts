import React, { useCallback, useEffect } from "react";

const useFixToPreventEmbeddedMapZoomOnScroll = (
  wrapperRef: React.RefObject<HTMLDivElement>
): ((event: React.SyntheticEvent) => void) => {
  useEffect(
    function disableEmbeddedContentMapEventsOnMouseLeave() {
      if (!wrapperRef.current) {
        return () => {};
      }
      const inContentEmbeddedMapsNodeList: NodeListOf<HTMLIFrameElement> =
        wrapperRef.current.querySelectorAll('iframe[data-src*="maps/d/embed"]');

      const inContentEmbeddedMaps = Array.from(inContentEmbeddedMapsNodeList);

      const disableEmbeddedMapEvents = (event: MouseEvent) => {
        const inContentMap = event.target as HTMLIFrameElement;

        // eslint-disable-next-line functional/immutable-data
        inContentMap.style.pointerEvents = "none";
      };

      inContentEmbeddedMaps.map(inContentMap =>
        inContentMap.addEventListener("mouseleave", disableEmbeddedMapEvents)
      );

      return () => {
        inContentEmbeddedMaps.map(inContentMap =>
          inContentMap.removeEventListener("mouseleave", disableEmbeddedMapEvents)
        );
      };
    },
    [wrapperRef]
  );

  const handleContenMapClick = useCallback((event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    const mapIframe = target.querySelector('iframe[data-src*="maps/d/embed"]') as HTMLIFrameElement;
    if (!mapIframe) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    mapIframe.style.pointerEvents = "auto";
  }, []);

  return handleContenMapClick;
};

export default useFixToPreventEmbeddedMapZoomOnScroll;
