import React, { ReactNode } from "react";
import styled from "@emotion/styled";

import BestPlacesMapHeader from "./BestPlacesMapHeader";

import LandingHeaderWrapper from "components/ui/Search/LandingHeaderWrapper";
import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import { mqMin } from "styles/base";
import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import { Cover } from "components/ui/ArticleLayout";
import { CoverMapWrapper as ArticleLayoutCoverMapWrapper } from "components/ui/ArticleLayout/ArticleLayout";
import SearchCoverContainer from "components/ui/Search/SearchCoverContainer";
import { useIsTablet } from "hooks/useMediaQueryCustom";

const CoverWrapper = styled.div<{}>`
  ${mqMin.large} {
    display: none;
  }
`;

const StyledFrontValuePropositions = styled(FrontValuePropositions)`
  display: none;

  ${mqMin.large} {
    display: block;
  }
`;

const PlacesSearchCoverContainer = ({
  cover,
  children,
  mapData,
  mapImages,
  isMobileFooterShown,
  shouldShowCover,
  locationPlaceholder,
}: {
  cover: SharedTypes.SearchCover;
  children?: ReactNode;
  mapData: SharedTypes.Map;
  mapImages: Image[];
  isMobileFooterShown: boolean;
  shouldShowCover: boolean;
  locationPlaceholder?: string;
}) => {
  const isTabletAndBigger = useIsTablet();

  return (
    <>
      <CoverWrapper>
        <LandingHeaderWrapper isShow={shouldShowCover}>
          <SearchCoverContainer cover={cover} showCover>
            {children}
          </SearchCoverContainer>
        </LandingHeaderWrapper>
      </CoverWrapper>
      <ArticleLayoutCoverMapWrapper>
        <CoverMap
          map={mapData}
          mapId="articles-map"
          fallbackCover={<Cover images={mapImages} />}
          isDirectionsEnabled={false}
          isStreetViewEnabled={false}
        >
          <BestPlacesMapHeader
            locationPlaceholder={locationPlaceholder}
            alwaysDisplay={isTabletAndBigger || isMobileFooterShown || !shouldShowCover}
          />
        </CoverMap>
      </ArticleLayoutCoverMapWrapper>
      <StyledFrontValuePropositions id="bestPlacesPageValueProps" />
    </>
  );
};

export default PlacesSearchCoverContainer;
