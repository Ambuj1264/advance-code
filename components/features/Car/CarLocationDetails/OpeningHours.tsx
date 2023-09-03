import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { constructOpeningHours } from "../utils/carUtils";

import { useTranslation } from "i18n";
import { typographyBody1, typographySubtitle1 } from "styles/typography";
import { gutters, blackColor, borderRadius, fontWeightSemibold } from "styles/variables";
import { combineMediaQueries, mqMin, mqPrint } from "styles/base";
import { Namespaces } from "shared/namespaces";

export const OpeningHourTitle = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    flex: 50%;
    color: ${theme.colors.primary};
  `,
]);

const Hours = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`;

export const HourItem = styled.div([
  typographyBody1,
  css`
    flex: 1 0 100%;
    color: ${rgba(blackColor, 0.7)};

    ${mqMin.medium} {
      flex: 1 0 33.3333%;
      text-align: right;
      &:nth-of-type(2n) {
        margin-left: ${gutters.small / 2}px;
      }
    }
  `,
]);

export const OpeningHourWrapper = styled.div<{ isActive: boolean }>(({ isActive, theme }) => [
  css`
    margin-bottom: ${gutters.small / 2}px;
    width: 100%;
    ${combineMediaQueries(mqMin.medium, mqPrint)} {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    ${combineMediaQueries(mqMin.desktop, mqPrint)} {
      flex-direction: row;
    }
  `,
  isActive &&
    css`
      ${HourItem},
      ${OpeningHourTitle} {
        color: ${theme.colors.primary};
        font-weight: ${fontWeightSemibold};
      }
    `,
]);

const OpeningHoursWrapper = styled.div(
  ({ theme }) =>
    css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: ${borderRadius};
      width: 100%;
      height: 100%;
      padding: ${gutters.small}px ${gutters.large / 2}px;
      background-color: ${rgba(theme.colors.primary, 0.02)};
    `
);

const OpeningHours = ({
  openingHours,
  activeLocale,
  activeDay,
  className,
}: {
  openingHours: CarTypes.QueryOpeningHour[];
  activeLocale: string;
  activeDay?: number;
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.carNs);
  const openingHoursOfDays = constructOpeningHours(openingHours, activeLocale, t);
  return (
    <OpeningHoursWrapper className={className}>
      {openingHoursOfDays.map(openingHour => {
        const isActive = activeDay === openingHour.dayOfWeek;

        return (
          <OpeningHourWrapper
            key={`openingHours${openingHour.day}`}
            className={isActive ? "active-hours" : ""}
            isActive={isActive}
          >
            <OpeningHourTitle>{openingHour.day}</OpeningHourTitle>
            <Hours>
              {openingHour.openingHours.map((hour, index) => (
                <HourItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={`openingHourItem${openingHour.day}${index}`}
                >
                  {hour}
                </HourItem>
              ))}
            </Hours>
          </OpeningHourWrapper>
        );
      })}
    </OpeningHoursWrapper>
  );
};

export default OpeningHours;
