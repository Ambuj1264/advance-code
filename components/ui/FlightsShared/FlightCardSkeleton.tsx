import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Separator, Line } from "./SharedFlightComponents";
import { TimelinePoint, StyledCircleIcon } from "./FlightTimelinePoint";
import { StyledFlightIcon } from "./FlightInformationPoint";
import FlightDate from "./FlightDate";

import { skeletonPulse, column, mqMin } from "styles/base";
import {
  borderRadiusSmall,
  gutters,
  boxShadowTileRegular,
  greyColor,
  borderRadius,
} from "styles/variables";
import Row from "components/ui/Grid/Row";

const Wrapper = styled.div`
  position: relative;
  box-shadow: ${boxShadowTileRegular};
  border: 1px solid ${rgba(greyColor, 0.2)};
  border-radius: ${borderRadius}px;
  height: 420px;
  padding: 12px;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: stretch;
  justify-content: flex-start;
`;

const Footer = styled(Row)`
  align-items: center;
  justify-content: space-between;
  height: 56px;
`;

const FooterColLeft = styled.div([
  column({ small: 1 / 2 }),
  css`
    display: none;
    align-items: center;
    height: 100%;
    ${mqMin.medium} {
      display: flex;
    }
  `,
]);

const FooterColRight = styled.div([
  css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
    width: 300px;
    padding: 0 ${gutters.small}px;
    text-align: right;
  `,
]);

const Button = styled.div([
  skeletonPulse,
  css`
    float: right;
    margin-left: ${gutters.small}px;
    border-radius: ${borderRadiusSmall};
    width: 120px;
    height: 40px;
    vertical-align: middle;
  `,
]);

const Features = styled.div([
  skeletonPulse,
  css`
    width: 150px;
    height: 20px;
  `,
]);

export const Price = styled.div([
  skeletonPulse,
  css`
    border-radius: ${borderRadiusSmall};
    width: 40%;
    height: 26px;
    vertical-align: middle;
  `,
]);

export const AirportInfoLoading = styled.div([
  skeletonPulse,
  css`
    margin-left: ${gutters.small}px;
    border-radius: ${borderRadiusSmall};
    width: 20%;
    height: 17px;
  `,
]);

export const AirlineLoading = styled.div([
  skeletonPulse,
  css`
    margin-left: ${gutters.small / 2}px;
    border-radius: ${borderRadiusSmall};
    width: 20px;
    height: 20px;
  `,
]);

export const DateLoading = styled.div([
  skeletonPulse,
  css`
    margin-left: ${gutters.small / 4}px;
    border-radius: ${borderRadiusSmall};
    width: 12.5%;
    height: 24px;
  `,
]);

const FooterWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    bottom: 0px;
    margin-left: -${gutters.large / 2}px;
    width: 100%;
    padding: 0 ${gutters.small}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);

const LoadingFlightClass = styled.div([
  skeletonPulse,
  css`
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 24px;
  `,
]);

const FlightWrapper = styled.div``;

const FlightLoading = () => (
  <FlightWrapper>
    <FlightDate>
      <DateLoading />
    </FlightDate>
    <TimelinePoint>
      <StyledCircleIcon />
      <AirportInfoLoading />
    </TimelinePoint>
    <Line />
    <TimelinePoint>
      <StyledFlightIcon />
      <AirportInfoLoading />
      <AirlineLoading />
      <AirlineLoading />
    </TimelinePoint>
    <Line />
    <TimelinePoint>
      <StyledCircleIcon />
      <AirportInfoLoading />
    </TimelinePoint>
    <FlightDate isDestination>
      <DateLoading />
    </FlightDate>
  </FlightWrapper>
);

const StyledSeparator = styled(Separator)`
  margin: ${gutters.small}px -${gutters.small}px 0;
  & + ${FlightWrapper} {
    margin-top: ${gutters.small}px;
  }
`;

const FlightCardSkeleton = ({ className }: { className?: string }) => (
  <Wrapper className={className}>
    <Content>
      <FlightLoading />
      <LoadingFlightClass />
      <StyledSeparator />
      <FlightLoading />
    </Content>
    <FooterWrapper>
      <Footer>
        <FooterColLeft>
          <Features />
        </FooterColLeft>
        <FooterColRight>
          <Price />
          <Button />
        </FooterColRight>
      </Footer>
    </FooterWrapper>
  </Wrapper>
);

export default FlightCardSkeleton;
