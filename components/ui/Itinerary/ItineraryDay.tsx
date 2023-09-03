import React, { useMemo, useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import { getMaxListIndexToShow } from "./itineraryUtils";
import ItineraryDayCarousel from "./ItineraryDayCarousel";

import { ImageSlideWrapper } from "components/ui/ImageCarousel/ImageCarousel";
import { SectionWrapper } from "components/ui/Section/Section";
import Row from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import {
  borderRadius,
  fontSizeBody1,
  fontSizeBody2,
  fontWeightSemibold,
  greyColor,
  gutters,
  lightBlueColor,
  loadingBlue,
  zIndex,
} from "styles/variables";
import { useTranslation } from "i18n";
import { mqMax, mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import PinLocationIcon from "components/icons/pin-location-1.svg";
import CalendarIcon from "components/icons/calendar-empty.svg";
import CameraIcon from "components/icons/camera-1.svg";
import {
  SectionHeaderDate,
  SectionHeaderDateContent,
} from "components/ui/BookingWidget/BookingWidgetSectionHeader";
import { TravelStopType } from "types/enums";
import { headingStyles } from "components/ui/Section/SectionHeading";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";

const LeftSectionHeading3 = styled.h3(({ theme }) => [
  headingStyles(theme),
  css`
    margin-bottom: ${gutters.large / 4}px;
    font-weight: ${fontWeightSemibold};
    line-height: 28px;
    text-align: left;
  `,
]);

const ImageCarouselWrapper = styled.div`
  position: relative;
  margin-bottom: ${gutters.small}px;
  border-radius: ${borderRadius};
  width: auto;
  height: 212px;
  background-color: ${loadingBlue};
  overflow: hidden;

  ${ImageSlideWrapper} {
    border-radius: ${borderRadius};
    height: 212px;
  }

  ${mqMin.large} {
    float: right;
    margin-bottom: 0;
    margin-left: ${gutters.large}px;
    width: calc(50% - ${gutters.large}px);
    height: 300px;

    ${ImageSlideWrapper} {
      height: 300px;
    }
  }
`;

const StyledRegionText = styled.p`
  margin-left: -${gutters.large}px;
  color: ${greyColor};
  font-size: ${fontSizeBody2};
  text-indent: ${gutters.large}px;
`;

const TravelStopList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  margin-bottom: ${gutters.small / 4}px;
  padding: 0;
  font-size: ${fontSizeBody2};
  line-height: 24px;
  text-align: center;
  list-style-position: inside;
`;

const TravelStopListItem = styled.li<{
  isClickable: boolean;
  isHidden: boolean;
  isTrigger?: boolean;
  isDestination?: boolean;
}>(({ isClickable, isHidden, isTrigger, isDestination }) => [
  css`
    position: relative;
    display: ${isHidden ? "none" : "list-item"};
    margin-left: 0;
    width: auto;
    padding-right: ${gutters.small / 2}px;
    padding-left: 0;
    cursor: ${isClickable ? "pointer" : "auto"};
    color: ${isClickable ? lightBlueColor : greyColor};
    font-size: ${isDestination ? fontSizeBody1 : fontSizeBody2};
    text-align: start;
    list-style: none;

    span {
      position: relative;
      display: inline-block;
      margin-left: ${gutters.large / 2}px;

      &:before {
        content: "•";
        position: absolute;
        left: -${gutters.large / 2 + 1}px;
        font-size: larger;
      }

      &:hover {
        text-decoration: ${isClickable ? "underline" : "none"};
      }
    }

    &:first-of-type {
      list-style-type: none;

      span {
        margin-left: auto;
        &:before {
          content: "";
        }
      }
    }
  `,
  isTrigger &&
    css`
      list-style-type: none;

      span {
        margin-left: auto;
        &:before {
          content: "";
        }
      }
    `,
]);

const StyledRow = styled(Row)`
  margin-bottom: ${gutters.large}px;
  ${mqMax.large} {
    margin-bottom: ${gutters.small}px;
  }
`;

const StyledSectionWrapper = styled(SectionWrapper)`
  &:first-of-type {
    margin-top: ${gutters.small}px;
  }
`;

const StyledSectionHeaderDate = styled(SectionHeaderDate)(
  ({ theme }) =>
    css`
      top: ${gutters.small / 2}px;
      right: ${gutters.small / 2}px;
      left: unset;
      z-index: ${zIndex.z1};

      ${mqMin.large} {
        left: unset;
      }
      ${SectionHeaderDateContent} {
        background-color: ${theme.colors.primary};
      }
    `
);

const IconWrapper = styled.span(
  ({ theme }) => css`
    display: inline-block;
    flex-shrink: 0;
    margin-right: ${gutters.large / 2}px;
    width: 16px;

    svg {
      margin-top: 5px;
      fill: ${theme.colors.primary};
    }
  `
);

const TitleWrapper = styled.div`
  display: flex;
  line-height: 26px;

  ${mqMin.large} {
    max-width: calc(50% - ${gutters.large}px);
  }
`;

const SeeMoreTrigger = styled.span(
  ({ theme }) => css`
    cursor: pointer;
    color: ${theme.colors.primary};
    font-size: ${fontSizeBody2};
    font-weight: ${fontWeightSemibold};

    svg {
      display: inline-block;
      margin-left: ${gutters.small / 4}px;
      width: 10px;
      height: 8px;
      fill: ${theme.colors.primary};
    }
  `
);

const StyledArrowIcon = styled(ArrowIcon, { shouldForwardProp: () => false })<{
  isUp: boolean;
}>(
  ({ isUp }) => css`
    transform: ${isUp ? "rotate(-90deg)" : "rotate(90deg)"};
  `
);

const TravelStops = ({
  travelStops,
  dayNumber,
  onClick,
  isDestination,
  className,
  itineraryLength,
}: {
  travelStops: TravelStopTypes.TravelStops[];
  dayNumber: number;
  onClick: (travelStopInfo: SharedTypes.Icon, currentDay: number) => void;
  isDestination?: boolean;
  className?: string;
  itineraryLength: number;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);

  const [isShowingAll, setIsShowingAll] = useState(false);

  const handleDisplay = useCallback(() => {
    setIsShowingAll(!isShowingAll);
  }, [isShowingAll]);

  const maxIndex = useMemo(
    () =>
      getMaxListIndexToShow({
        charLimit: isDestination ? 60 : 85,
        travelStops,
      }),
    [isDestination, travelStops]
  );

  const isListTooBig = Boolean(maxIndex !== -1 && travelStops.length > 1);

  if (travelStops.length === 0) return null;

  const arrivalString =
    isDestination && dayNumber === 1 ? ` - ${vacationPackageT("Arrival Day")}` : undefined;
  const departureString =
    isDestination && dayNumber === itineraryLength
      ? ` - ${vacationPackageT("Departure Day")}`
      : undefined;

  return (
    <TravelStopList className={className}>
      {travelStops.map((travelStop, index) => (
        <TravelStopListItem
          key={`${travelStop.info.id}-${dayNumber}`}
          isDestination={isDestination}
          isHidden={isListTooBig && !isShowingAll && index > 0 && index >= maxIndex}
          isClickable={Boolean(travelStop.info.isClickable)}
          onClick={() =>
            travelStop.info.isClickable ? onClick(travelStop.info, dayNumber - 1) : {}
          }
        >
          <span>
            {travelStop.info.title}
            {index === travelStops.length - 1 ? arrivalString ?? departureString : null}
          </span>
        </TravelStopListItem>
      ))}
      <TravelStopListItem
        isDestination={isDestination}
        isHidden={!isListTooBig}
        isTrigger
        isClickable={false}
      >
        <SeeMoreTrigger onClick={handleDisplay}>
          {!isShowingAll ? vacationPackageT("More") : vacationPackageT("Less")}
          <StyledArrowIcon isUp={isShowingAll} />
        </SeeMoreTrigger>
      </TravelStopListItem>
    </TravelStopList>
  );
};

const ItineraryDay = ({
  itineraryLength,
  dayNumber,
  currentWeekDay,
  itineraryDay,
  createHandleTravelStopModalToggle,
}: {
  itineraryLength: number;
  dayNumber: number;
  currentWeekDay: string;
  itineraryDay: VacationPackageTypes.VacationPackageDay;
  createHandleTravelStopModalToggle: (
    travelStop: TravelStopTypes.TravelStops[],
    travelStopType: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
}) => {
  const isDesktop = useIsDesktop();
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { id, region, description, attractions, destinations = [] } = itineraryDay;
  const onToggleAttraction = useMemo(
    () => createHandleTravelStopModalToggle(attractions, TravelStopType.ATTRACTION),
    [attractions, createHandleTravelStopModalToggle]
  );
  const onToggleDestination = useMemo(
    () => createHandleTravelStopModalToggle(destinations, TravelStopType.DESTINATION),
    [createHandleTravelStopModalToggle, destinations]
  );
  const images = useMemo(
    () =>
      [...attractions, ...destinations]
        .map(attraction => attraction.info.image)
        .filter(image => Boolean(image?.url)) as Image[],
    [attractions, destinations]
  );
  const [dayTitle, setDayTitle] = useState<string>(
    vacationPackageT("Day {dayNumber} in {region}", {
      dayNumber,
      region: itineraryDay.region,
    })
  );
  useEffect(() => setDayTitle(currentWeekDay), [currentWeekDay]);

  return (
    <StyledSectionWrapper>
      <StyledRow>
        <Column>
          <ImageCarouselWrapper>
            <StyledSectionHeaderDate>
              {vacationPackageT("Day {dayNumber}", {
                dayNumber,
              }).replace(" ", "\n")}
            </StyledSectionHeaderDate>
            <ItineraryDayCarousel
              mapData={itineraryDay.attractionsMapData}
              itineraryDayNumber={dayNumber}
              images={images}
              height={isDesktop ? 300 : 212}
            />
          </ImageCarouselWrapper>
          <TitleWrapper>
            <IconWrapper>
              <CalendarIcon />
            </IconWrapper>
            <LeftSectionHeading3>{dayTitle}</LeftSectionHeading3>
          </TitleWrapper>
          <TitleWrapper>
            <IconWrapper>
              <PinLocationIcon />
            </IconWrapper>
            {destinations.length === 0 && <StyledRegionText>{region}</StyledRegionText>}
            <TravelStops
              travelStops={destinations}
              dayNumber={dayNumber}
              onClick={onToggleDestination}
              itineraryLength={itineraryLength}
              isDestination
            />
          </TitleWrapper>
          <TitleWrapper>
            {attractions.length > 0 && (
              <IconWrapper>
                <CameraIcon />
              </IconWrapper>
            )}
            <TravelStops
              travelStops={attractions}
              dayNumber={dayNumber}
              onClick={onToggleAttraction}
              itineraryLength={itineraryLength}
            />
          </TitleWrapper>
          {description && <ExpandableText id={`${id}DayDescription`} text={description} />}
        </Column>
      </StyledRow>
    </StyledSectionWrapper>
  );
};

export default ItineraryDay;
