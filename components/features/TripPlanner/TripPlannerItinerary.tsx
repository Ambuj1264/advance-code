import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TripPlannerItineraryItem, { IconWrapper, Wrapper } from "./TripPlannerItineraryItem";
import { TripPlannerDay } from "./types/tripPlannerTypes";

import Column from "components/ui/Grid/Column";
import LeftSectionHeading from "components/ui/Section/SectionHeading";
import CalendarIcon from "components/icons/calendar-empty.svg";
import { fontWeightSemibold, separatorColorDark } from "styles/variables";
import { DefaultMarginBottom, mqMin } from "styles/base";

const dailyItineraryStyle = css`
  ${DefaultMarginBottom};
  &:nth-of-type(5n),
  &:last-of-type {
    border-right: none;
  }

  ${mqMin.large} {
    border-right: 1px solid ${separatorColorDark};
    min-height: 185px;
  }
`;

const StyledLeftSectionHeading = styled(LeftSectionHeading)(() => [
  css`
    font-weight: ${fontWeightSemibold};
  `,
]);

const iconStyles = (theme: Theme) => css`
  width: auto;
  height: 16px;
  min-height: 16px;
  fill: ${theme.colors.primary};
`;

const TripPlannerItinerary = ({ day, dayIndex }: { day: TripPlannerDay; dayIndex: number }) => {
  return (
    <Column columns={{ large: 5 }} css={dailyItineraryStyle}>
      <Wrapper hasMarginBottom>
        <IconWrapper>
          <CalendarIcon css={iconStyles} />
        </IconWrapper>
        <StyledLeftSectionHeading>Day {dayIndex}</StyledLeftSectionHeading>
      </Wrapper>
      {day.itinerary.map(activity => (
        <TripPlannerItineraryItem activity={activity} key={activity.id} />
      ))}
    </Column>
  );
};

export default TripPlannerItinerary;
