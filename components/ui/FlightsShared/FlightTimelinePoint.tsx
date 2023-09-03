import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Line } from "./SharedFlightComponents";

import { typographySubtitle3 } from "styles/typography";
import { greyColor, fontWeightSemibold, blackColor, gutters } from "styles/variables";
import CircleIcon from "components/icons/circle.svg";

export const StyledCircleIcon = styled(CircleIcon)(
  ({ theme }) => css`
    margin-left: 3px;
    height: 5px;
    fill: ${theme.colors.primary};
  `
);

const PlaceTitle = styled.span([
  typographySubtitle3,
  css`
    margin-left: ${gutters.large / 2}px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const AirportCode = styled.span([
  typographySubtitle3,
  css`
    margin-left: ${gutters.small / 4}px;
    color: ${rgba(greyColor, 0.7)};
    font-weight: ${fontWeightSemibold};
  `,
]);

export const TimelinePoint = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FlightTimelinePoint = ({
  timeOfDeparture,
  place,
  airportCode,
  hasConnection = true,
  className,
  isDetailedView,
}: {
  timeOfDeparture: string;
  place: string;
  airportCode: string;
  hasConnection?: boolean;
  className?: string;
  isDetailedView?: boolean;
}) => {
  return (
    <>
      <TimelinePoint className={className}>
        <StyledCircleIcon />
        <PlaceTitle>{`${timeOfDeparture} ${place}`}</PlaceTitle>
        <AirportCode>{airportCode}</AirportCode>
      </TimelinePoint>
      {hasConnection && <Line isDetailedView={isDetailedView} />}
    </>
  );
};

export default FlightTimelinePoint;
