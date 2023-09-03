import React from "react";
import styled from "@emotion/styled";

import TravelplanMobileModalWrapper from "./components/TravelplanMobileModalWrapper";
import PBMapPagination from "./PBMapPagination";
import { TravelplanContentWrapper } from "./components/PBSharedComponents";
import { PostBookingTypes } from "./types/postBookingTypes";

import { getClientSideUrl } from "utils/helperUtils";
import { PageType } from "types/enums";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useClientSideRedirect } from "hooks/useRedirect";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";
import { mqMax } from "styles/base";

const CoverMapStyled = styled(CoverMap)`
  ${mqMax.large} {
    width: 100%;
    height: 100%;

    ${CoverMapWrapper} {
      width: 100%;
      height: 100%;
    }
  }
`;

const PBMobileMap = ({
  mapData,
  navigationDays,
  pageTitle,
  day,
}: {
  mapData: SharedTypes.Map;
  navigationDays?: PostBookingTypes.NavigationDay[];
  pageTitle: string;
  day?: number;
}) => {
  const isMobile = useIsMobile();
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();

  useClientSideRedirect({
    to: getClientSideUrl(PageType.GTE_POST_BOOKING, activeLocale, marketplace),
    condition: !isMobile,
  });

  return isMobile ? (
    <TravelplanMobileModalWrapper pageTitle={pageTitle}>
      <>
        <PBMapPagination navigationDays={navigationDays} activeDay={day} />
        <TravelplanContentWrapper>
          <CoverMapStyled
            map={mapData}
            mapId="pb-mobile-map"
            isDirectionsEnabled={false}
            isStreetViewEnabled={false}
            useAlternateInfobox
            useAlternateStaticImageOnly
            skipCoverImage
          />
        </TravelplanContentWrapper>
      </>
    </TravelplanMobileModalWrapper>
  ) : null;
};

export default PBMobileMap;
