import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { StyledTileCardWrapper } from "./MobileOverallSearchTileCard";
import { OverallDesktopContainer, OverallMobileContainer } from "./PageSearchInputContainer";

import { skeletonPulse } from "styles/base";
import { borderRadiusSmall } from "styles/variables";
import TileProductCardSkeleton from "components/ui/Search/TileProductCardSkeleton";

const Headline = styled.div(
  skeletonPulse,
  css`
    width: 50%;
    height: 24px;
  `
);

export const LoadingCategoryContainer = styled.div([
  skeletonPulse,
  css`
    display: flex;
    margin: 2px 0 10px 0;
    border-radius: ${borderRadiusSmall};
    width: 96px;
    height: 24px;
  `,
]);

const LoadingDescriptionLine = styled.div([
  skeletonPulse,
  css`
    width: 100%;
    height: 20px;
  `,
]);

const OverallSearchTileCardSkeleton = () => {
  return (
    <>
      <OverallMobileContainer>
        <StyledTileCardWrapper>
          <Headline />
          <LoadingCategoryContainer />
          <LoadingDescriptionLine />
          <LoadingDescriptionLine />
        </StyledTileCardWrapper>
      </OverallMobileContainer>
      <OverallDesktopContainer>
        <TileProductCardSkeleton />
      </OverallDesktopContainer>
    </>
  );
};

export default OverallSearchTileCardSkeleton;
