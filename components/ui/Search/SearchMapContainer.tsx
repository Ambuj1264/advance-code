import React from "react";
import styled from "@emotion/styled";

import ArticleLayoutCoverMapWrapper from "components/ui/ArticleLayout/ArticleLayoutCoverMapWrapper";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";
import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import { mqMin } from "styles/base";

const StyledCoverMapWrapper = styled(ArticleLayoutCoverMapWrapper)`
  ${CoverMapWrapper} {
    margin-bottom: 12px;
    ${mqMin.medium} {
      width: 100%;
      height: 339px;
    }
  }
  ${mqMin.large} {
    margin-top: 0;
  }
`;

const SearchMapContainer = ({
  map,
  isClustersEnabled = true,
}: {
  map: SharedTypes.Map;
  isClustersEnabled?: boolean;
}) => {
  return (
    <StyledCoverMapWrapper>
      <CoverMap
        map={map}
        mapId="search-map"
        isDirectionsEnabled={false}
        isStreetViewEnabled={false}
        isClustersEnabled={isClustersEnabled}
      />
    </StyledCoverMapWrapper>
  );
};

export default SearchMapContainer;
