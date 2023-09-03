import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { GridItemWrapper } from "./SearchList";
import { TilePlaceCardSSRSkeleton } from "./TilePlaceCard";

import { skeletonPulse, skeletonPulseBlue } from "styles/base";
import { borderRadiusSmall, gutters, lightGreyColor } from "styles/variables";

const Wrapper = styled.div([
  css`
    border: 1px solid ${lightGreyColor};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 334px;
    text-align: center;
  `,
]);

const Image = styled.div([
  skeletonPulseBlue,
  css`
    width: 100%;
    height: 170px;
  `,
]);

const Content = styled.div([
  css`
    box-sizing: border-box;
    padding: 0 ${gutters.small}px;
  `,
]);

const TitleFirstLine = styled.div([
  skeletonPulse,
  css`
    width: 100%;
    height: 12px;
  `,
]);

const TitleSecondLine = styled.div([
  skeletonPulse,
  css`
    width: 168px;
    height: 12px;
  `,
]);

const Description = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 100%;
    height: 88px;
  `,
]);

const TilePlaceCardSkeleton = () => (
  <Wrapper>
    <Image />
    <Content>
      <TitleFirstLine />
      <TitleSecondLine />
      <Description />
    </Content>
  </Wrapper>
);

export const TilePlaceSSRSkeletonGridElement = (product: SharedTypes.PlaceProduct) => (
  <GridItemWrapper>
    <TilePlaceCardSSRSkeleton {...product} />
  </GridItemWrapper>
);

export default TilePlaceCardSkeleton;
