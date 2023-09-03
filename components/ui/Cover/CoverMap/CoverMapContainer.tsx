import React, { memo } from "react";

import CoverMapWrapper from "./CoverMapWrapper";
import { useGetCurrentMapType } from "./hooks/useGetAvailableMap";
import LeafletMapContainer from "./Leaflet/LeafletMapContainer";

import CustomNextDynamic from "lib/CustomNextDynamic";
import CoverGoogleMap from "components/ui/Cover/CoverMap/Google/CoverGoogleMap";
import { MAP_TYPE, Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const CoverBaiduMap = CustomNextDynamic(
  () => import("components/ui/Cover/CoverMap/Baidu/BaiduMapContainer"),
  {
    ssr: false,
    loading: () => <CoverMapWrapper />,
  }
);

const CoverMapContainer = (props: {
  mapId?: string;
  map: SharedTypes.Map;
  fallbackCover?: React.ReactElement;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  isStreetViewEnabled?: boolean;
  isDirectionsEnabled?: boolean;
  isClustersEnabled?: boolean;
  useSmallButtons?: boolean;
  useAlternateInfobox?: boolean;
  children?: React.ReactNode;
  className?: string;
  useAlternateStaticImageOnly?: boolean;
  skipCoverImage?: boolean;
}) => {
  const mapType = useGetCurrentMapType();
  const { marketplace } = useSettings();
  const { fallbackCover = null } = props;
  const shouldRenderChineseMap = mapType === MAP_TYPE.BAIDU;
  const shouldRenderChineseFallback = mapType === MAP_TYPE.BAIDU_FALLBACK_COVER && fallbackCover;

  if (marketplace === Marketplace.GUIDE_TO_EUROPE) {
    return <LeafletMapContainer {...props} />;
  }

  if (shouldRenderChineseMap) {
    // skip alternate infobox display for BAIDU map, by some reason, when I click on "directions" link
    // in the infomodal, the opened BAIDU map cannot find anything related to the clicked point
    return <CoverBaiduMap {...props} />;
  }

  if (shouldRenderChineseFallback) {
    return fallbackCover;
  }

  return <CoverGoogleMap {...props} />;
};

export default memo(CoverMapContainer);
