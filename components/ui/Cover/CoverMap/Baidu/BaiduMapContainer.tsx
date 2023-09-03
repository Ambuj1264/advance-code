import React from "react";
import styled from "@emotion/styled";

import useEventsHandlerTrigger from "../Google/hooks/useEventsHandlerTrigger";
import Cover, { RightBottomContent, RightTopContent } from "../../Cover";
import CoverMapWrapper from "../CoverMapWrapper";
import { DirectionIcon, DirectionsButton } from "../CoverMapButtons";
import { getCoverMapImage } from "../Google/mapUtils";

import { getBaiduMapDirectionPageUrl } from "./mapUtils";

import { Trans } from "i18n";
import { whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import MapPlaceholder from "components/ui/Cover/CoverMap/Google/MapPlaceholder";
import { useSettings } from "contexts/SettingsContext";
import useOnPageLoadWithDelay from "hooks/useOnPageLoadWithDelay";
import { LeftBottomContent } from "components/ui/Cover/CoverMap/Google/CoverGoogleMap";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { Leaf } from "components/ui/ReviewSummary/ReviewSummaryScore";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";
import { Stars } from "components/ui/ReviewStars";

const MAP_ID = "cover-baidu-map";

const LazyBaiduMapJs = CustomNextDynamic(
  () => import("components/ui/Cover/CoverMap/Baidu/CoverBaiduJsAPI"),
  {
    loading: () => null,
    ssr: false,
  }
);

const MapContainer = styled.div`
  height: 100%;

  .infoBox {
    transform: translateY(-13px);
  }

  .infoBox > img {
    display: none;
  }

  .infoBox ${Leaf} {
    fill: ${whiteColor};
  }

  .infoBox ${ReviewTotalCountText} {
    color: ${whiteColor};
  }

  .infoBox ${Stars} {
    display: flex;
  }

  /* Clusters icons */
  /* stylelint-disable selector-max-type */
  > div:first-of-type div {
    background-size: cover;
  }
`;

const BaiduMapContainer = ({
  map,
  rightTopContent,
  rightBottomContent,
  children,
  isClustersEnabled = true,
  isDirectionsEnabled = true,
  useSmallButtons = false,
  className,
  useAlternateInfobox = false,
}: {
  map: SharedTypes.Map;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  children?: React.ReactNode;
  isClustersEnabled?: boolean;
  isDirectionsEnabled?: boolean;
  useSmallButtons?: boolean;
  className?: string;
  useAlternateInfobox?: boolean;
}) => {
  // TODO: 🤔 google key to generate BAIDU static image ?
  const { googleApiKey } = useSettings();

  const [mapWrapperRef, eventFiredOverMap] = useEventsHandlerTrigger({
    events: ["mouseover", "pointerenter"],
  });
  const isTimeToBeInteractive = useOnPageLoadWithDelay({ delay: 2000 });

  const showInteractiveMap = eventFiredOverMap || isTimeToBeInteractive;
  const coverMapImage = getCoverMapImage(map, googleApiKey);

  return (
    <CoverMapWrapper ref={mapWrapperRef} className={className}>
      <Cover imageUrls={[coverMapImage]} showShadow={false} />
      <MapPlaceholder>
        <MapContainer id={MAP_ID} />
      </MapPlaceholder>

      {showInteractiveMap && (
        <LazyBaiduMapJs
          map={map}
          mapId={MAP_ID}
          isClustersEnabled={isClustersEnabled}
          useAlternateInfobox={useAlternateInfobox}
        />
      )}

      <LeftBottomContent>
        {isDirectionsEnabled && (
          <DirectionsButton
            href={getBaiduMapDirectionPageUrl(map)}
            rel="nofollow noopener"
            target="_blank"
            isSmall={useSmallButtons}
          >
            <DirectionIcon isSmall={useSmallButtons} />
            <Trans ns={Namespaces.articleNs}>Directions</Trans>
          </DirectionsButton>
        )}
      </LeftBottomContent>

      {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
      {rightBottomContent && <RightBottomContent>{rightBottomContent}</RightBottomContent>}
      {children}
    </CoverMapWrapper>
  );
};

export default BaiduMapContainer;
