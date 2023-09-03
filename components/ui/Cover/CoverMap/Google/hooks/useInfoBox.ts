import { useEffect, useState } from "react";

import CustomInfoBox from "../InfoBox";
import { MARKER_SIZE } from "../../mapConstants";

import usePortalContainer from "./usePortalContainer";

const useInfoBox = ({ mapInstance, options }: { mapInstance?: google.maps.Map; options?: any }) => {
  const [infoBox, setInfoBox] = useState<CustomInfoBox>();
  const { containerRef: infoBoxContainerRef, PortalContainer: InfoBoxContainer } =
    usePortalContainer();

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    // initialize custom InfoBox
    const customInfoBox = new CustomInfoBox({
      alignBottom: true,
      alignCenter: true,
      // vertically it is the size of marker image to show infoBox above the marker
      pixelOffset: new window.google.maps.Size(0, -MARKER_SIZE / 2),
      // it's a space we guarantee between the map corner and infoBox
      infoBoxClearance: new window.google.maps.Size(20, 20),
      enableEventPropagation: true,
      ...(options || {}),
    });
    customInfoBox.setContent(infoBoxContainerRef.current!);
    setInfoBox(customInfoBox);
  }, [setInfoBox, mapInstance, infoBoxContainerRef, options]);

  return { infoBox, InfoBoxContainer };
};

export default useInfoBox;
