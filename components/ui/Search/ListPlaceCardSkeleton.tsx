import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import Row from "components/ui/Grid/Row";
import { skeletonPulse, skeletonPulseBlue } from "styles/base";
import { borderRadiusSmall, gutters, lightGreyColor } from "styles/variables";

const Wrapper = styled.div`
  border: 1px solid ${lightGreyColor};
  border-radius: ${borderRadiusSmall};
  height: 226px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: stretch;
  justify-content: flex-start;
`;

const Image = styled.div([
  skeletonPulseBlue,
  css`
    flex-basis: 330px;
    flex-shrink: 0;
    align-self: flex-start;
    width: 330px;
    height: 170px;
  `,
]);

const RightContentColumn = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  margin: ${gutters.small}px ${gutters.small}px 0 ${gutters.large}px;
`;

const TitleFirstLine = styled.div([
  skeletonPulse,
  css`
    width: 60%;
    height: 14px;
  `,
]);

const ContentRow = styled(Row)`
  justify-content: space-between;
  padding-top: ${gutters.large}px;
  padding-left: ${gutters.small}px;
`;

const ContentColumn = styled.div`
  width: 90%;
`;

const Line = styled.div([
  skeletonPulse,
  css`
    margin-right: ${gutters.small}px;
    height: 14px;
  `,
]);

const FooterWrapper = styled.div`
  padding: 0 ${gutters.small}px;
  background-color: ${rgba(lightGreyColor, 0.3)};
`;

const Footer = styled.div`
  height: 56px;
`;

const Button = styled.div([
  skeletonPulse,
  css`
    float: right;
    margin-top: ${gutters.small / 2}px;
    margin-left: ${gutters.small}px;
    border-radius: ${borderRadiusSmall};
    width: 120px;
    height: 40px;
    vertical-align: middle;
  `,
]);

const ListPlaceCardSkeleton = () => (
  <Wrapper>
    <Content>
      <Image />
      <RightContentColumn>
        <TitleFirstLine />
        <ContentRow>
          <ContentColumn>
            <Line />
            <Line />
            <Line />
            <Line />
          </ContentColumn>
        </ContentRow>
      </RightContentColumn>
    </Content>
    <FooterWrapper>
      <Footer>
        <Button />
      </Footer>
    </FooterWrapper>
  </Wrapper>
);

export default ListPlaceCardSkeleton;
