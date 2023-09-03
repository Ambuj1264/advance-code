import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { GridItemWrapper } from "./SearchList";
import { TileProductCardSSRSkeleton } from "./TileProductCard";

import Row from "components/ui/Grid/Row";
import { column, skeletonPulse, skeletonPulseBlue } from "styles/base";
import { borderRadiusSmall, gutters, lightGreyColor } from "styles/variables";

export const Wrapper = styled.div([
  css`
    border: 1px solid ${lightGreyColor};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 427px;
    text-align: center;
  `,
]);

const Image = styled.div([
  skeletonPulseBlue,
  css`
    width: 100%;
    height: 207px;
  `,
]);

const Content = styled.div([
  css`
    box-sizing: border-box;
    height: 226px;
    padding: 0 ${gutters.small}px;
  `,
]);

const TitleFirstLine = styled.div([
  skeletonPulse,
  css`
    width: 100%;
    height: 14px;
  `,
]);

const TitleSecondLine = styled.div([
  skeletonPulse,
  css`
    width: 168px;
    height: 14px;
  `,
]);

const Description = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 100%;
    height: 104px;
  `,
]);

const Footer = styled(Row)(css`
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`);

const ColLeft = styled.div([css(column({ small: 2 / 5 }))]);

const ColRight = styled.div([
  css(column({ small: 1 / 2 })),
  css`
    text-align: right;
  `,
]);

const Feature = styled.div([
  skeletonPulse,
  css`
    width: 100%;
    height: 12px;
  `,
]);

const Price = styled.div([
  skeletonPulse,
  css`
    width: 40%;
    height: 26px;
  `,
]);

const Button = styled.div([
  skeletonPulse,
  css`
    margin-left: ${gutters.small}px;
    border-radius: 50%;
    width: 26px;
    height: 26px;
  `,
]);

const TileProductCardSkeleton = ({ className }: { className?: string }) => (
  <Wrapper className={className}>
    <Image />
    <Content>
      <TitleFirstLine />
      <TitleSecondLine />
      <Description />
      <Footer>
        <ColLeft>
          <Feature />
        </ColLeft>
        <ColRight>
          <Price />
          <Button />
        </ColRight>
      </Footer>
    </Content>
  </Wrapper>
);

export const TileProductSSRSkeletonGridElement = ({
  linkUrl,
  headline,
}: {
  linkUrl: string;
  headline: string;
}) => (
  <GridItemWrapper>
    <TileProductCardSSRSkeleton linkUrl={linkUrl} headline={headline} />
  </GridItemWrapper>
);

export default TileProductCardSkeleton;
