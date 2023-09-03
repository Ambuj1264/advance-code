import styled from "@emotion/styled";
import React from "react";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Line } from "./SharedFlightComponents";

import CalendarIcon from "components/icons/calendar-empty.svg";
import { typographyBody2 } from "styles/typography";
import { blackColor, gutters } from "styles/variables";

const DateWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const StyledCalendarIcon = styled(CalendarIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 12px;
  height: 12px;
  fill: ${rgba(blackColor, 0.7)};
`;

const FlightDate = ({
  children,
  isDestination,
  isDetailedView,
}: {
  isDestination?: boolean;
  isDetailedView?: boolean;
  children: React.ReactNode;
}) => (
  <>
    {isDestination && <Line isDotted isDetailedView={isDetailedView} />}
    <DateWrapper>
      <StyledCalendarIcon />
      {children}
    </DateWrapper>
    {!isDestination && <Line isDotted isDetailedView={isDetailedView} />}
  </>
);

export default FlightDate;
