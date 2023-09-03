import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { PageLabelPlacement } from "./OverallSearchListCard";
import { LoadingCategoryContainer } from "./OverallSearchTileCardSkeleton";

import Row from "components/ui/Grid/Row";
import { column, skeletonPulse, skeletonPulseBlue } from "styles/base";
import { borderRadiusSmall, gutters, lightGreyColor } from "styles/variables";

const Wrapper = styled.div([
  css`
    position: relative;
    border: 1px solid ${lightGreyColor};
    border-radius: ${borderRadiusSmall};
    height: 171px;
  `,
]);

export const Content = styled.div(css`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: stretch;
  justify-content: flex-start;
`);

const Image = styled.div([
  skeletonPulseBlue,
  css`
    width: 181px;
    height: 114px;
  `,
]);

const RightContentColumn = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  margin: ${gutters.small / 2}px ${gutters.small}px 0 ${gutters.large}px;
`;

const TitleFirstLine = styled.div([
  skeletonPulse,
  css`
    width: 30%;
    height: 14px;
  `,
]);

const ContentRow = styled(Row)([
  css`
    justify-content: space-between;
    padding-top: ${gutters.large}px;
  `,
]);

const ContentColumn = styled.div([css(column({ small: 4 / 5 }))]);

const Line = styled.div([
  skeletonPulse,
  css`
    margin-right: ${gutters.small}px;
    height: 14px;
  `,
]);

const FooterWrapper = styled.div(css`
  padding: 0 ${gutters.small}px;
  background-color: ${rgba(lightGreyColor, 0.3)};
`);

const Footer = styled(Row)(css`
  align-items: center;
  justify-content: space-between;
  height: 56px;
`);

const FooterColLeft = styled.div([css(column({ small: 1 / 2 }))]);

const FooterColRight = styled.div([
  css(column({ small: 7 / 20 })),
  css`
    text-align: right;
  `,
]);

const Button = styled.div([
  skeletonPulse,
  css`
    margin-left: ${gutters.small}px;
    border-radius: ${borderRadiusSmall};
    width: 120px;
    height: 40px;
    vertical-align: middle;
  `,
]);

const OverallSearchListCardSkeleton = () => (
  <Wrapper>
    <Content>
      <Image />
      <RightContentColumn>
        <PageLabelPlacement>
          <LoadingCategoryContainer />
        </PageLabelPlacement>
        <TitleFirstLine />
        <ContentRow>
          <ContentColumn>
            <Line />
            <Line />
          </ContentColumn>
        </ContentRow>
      </RightContentColumn>
    </Content>
    <FooterWrapper>
      <Footer>
        <FooterColLeft />
        <FooterColRight>
          <Button />
        </FooterColRight>
      </Footer>
    </FooterWrapper>
  </Wrapper>
);

export default OverallSearchListCardSkeleton;
