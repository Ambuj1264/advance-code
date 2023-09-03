import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import React, { Fragment } from "react";

import { Line } from "./SharedFlightComponents";

import { Namespaces } from "shared/namespaces";
import FlightIcon from "components/icons/plane-1.svg";
import LazyImage from "components/ui/Lazy/LazyImage";
import { typographySubtitle3, typographyCaptionSmall } from "styles/typography";
import { gutters, borderRadiusSmall, greyColor, borderRadius20, blueColor } from "styles/variables";
import HighlightedText from "components/ui/HighlightedText";
import { useTranslation } from "i18n";
import { getDuration } from "utils/helperUtils";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import { getImgixImageFromKiwi } from "utils/imageUtils";

const TimelinePoint = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledFlightIcon = styled(FlightIcon)(
  ({ theme }) => css`
    width: 12px;
    height: 12px;
    fill: ${theme.colors.primary};
  `
);

const Stops = styled.span(({ theme }) => [
  typographySubtitle3,
  css`
    display: block;
    margin-left: ${gutters.small / 2}px;
    color: ${theme.colors.primary};
  `,
]);

const StyledLazyImage = styled(LazyImage)`
  margin-left: ${gutters.small / 2}px;
  border-radius: ${borderRadiusSmall};
  width: 20px;
  height: 20px;
`;

const FlightNumber = styled.span([
  typographySubtitle3,
  css`
    margin-left: ${gutters.small / 2}px;
    color: ${rgba(greyColor, 0.7)};
  `,
]);

const StyledMediaQuery = styled(MediaQuery)`
  line-height: ${gutters.small}px;
`;

const FlightClassPillDetailView = styled.span([
  typographyCaptionSmall,
  css`
    margin-left: ${gutters.small / 2}px;
    border-radius: ${borderRadius20};
    padding: ${gutters.small / 4}px ${gutters.small / 2}px;
    background-color: ${rgba(blueColor, 0.05)};
    color: ${greyColor};
  `,
]);

const FlightInformationPoint = ({
  durationInSec,
  numberOfStops,
  airlines,
  flightNumber,
  isDetailedView,
  flightClass,
}: {
  durationInSec: number;
  numberOfStops?: number;
  flightNumber?: string;
  airlines: FlightSearchTypes.Airline[];
  isDetailedView?: boolean;
  flightClass?: string;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const [hours, minutes] = getDuration(durationInSec);
  return (
    <>
      <TimelinePoint>
        <StyledFlightIcon />
        <HighlightedText>{t("{hours}h {minutes}m", { hours, minutes })}</HighlightedText>
        {numberOfStops !== undefined && (
          <Stops>
            {numberOfStops ? t("{numberOfStops} stops", { numberOfStops }) : t("Direct")}
          </Stops>
        )}
        {airlines.map((airline, index) => {
          const airlineImageUrl = getImgixImageFromKiwi(urlToRelative(airline.imageUrl));
          return (
            <Fragment key={`${airline.code}${index.toString()}`}>
              <StyledLazyImage
                key={airline.name}
                src={airlineImageUrl}
                alt={airline.name}
                height={20}
                width={20}
                title={airline.name}
              />
              {airlines.length === 1 && (
                <>
                  <StyledMediaQuery fromDisplay={DisplayType.Medium}>
                    <Stops>{airline.name}</Stops>
                  </StyledMediaQuery>
                  {flightNumber && <FlightNumber>{flightNumber}</FlightNumber>}
                  {isDetailedView && flightClass && (
                    <FlightClassPillDetailView>{flightClass}</FlightClassPillDetailView>
                  )}
                </>
              )}
            </Fragment>
          );
        })}
      </TimelinePoint>
      <Line isDetailedView={isDetailedView} />
    </>
  );
};

export default FlightInformationPoint;
