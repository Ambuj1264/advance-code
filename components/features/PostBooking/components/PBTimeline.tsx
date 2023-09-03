import React, { memo } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

import { PostBookingTypes } from "../types/postBookingTypes";
import {
  PB_CARD_TYPE,
  PB_ITINERARY_ICON_TYPE,
  PB_ITINERARY_TRAVELMODE_TYPE,
} from "../types/postBookingEnums";
import { constructPBProductCard } from "../utils/postBookingCardUtils";
import { getTransportationTextLabel } from "../utils/pbCardLabelConstructionUtils";
import { useGetPBClientRoutes } from "../hooks/useGetPBClientRoutes";

import { PostBookingTimelineItem } from "./PBTimelineItem";
import { PBTimelineNavigationItem } from "./PBTimelineNavigationItem";

import { mqMin } from "styles/base";
import { guttersPx } from "styles/variables";
import ClientLink from "components/ui/ClientLink";
import useActiveLocale from "hooks/useActiveLocale";
import { Namespaces } from "shared/namespaces";
import { toDateWithoutTimezone } from "utils/dateUtils";

const TimelineWrapper = styled.div`
  width: 100%;
  padding-top: ${guttersPx.small};
  ${mqMin.large} {
    padding-top: 0;
  }
`;

const SUPPORTED_DAY_ITINERARY_CARDS = Object.keys(PB_CARD_TYPE).filter(
  type => type !== PB_CARD_TYPE.UNDEFINED
);

const DayItineraryPure = ({ day }: { day: PostBookingTypes.ItineraryDay }) => {
  const daySegments = day.segments ?? [];
  const lastDaySegmentIndex = (daySegments.length ?? 1) - 1;
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const locale = useActiveLocale();

  return (
    <>
      {daySegments
        .sort(({ index: i1 }, { index: i2 }) => i1 - i2)
        .map((segment, segmentIndex) => {
          const segmentContent =
            segment.content ?? ([] as PostBookingTypes.ItinerarySegmentContent[]);

          const lastItemContentIndex = segmentContent.length - 1;
          return segmentContent.map((content, index) => (
            <PostBookingTimelineItem
              key={content.index}
              iconType={content.icon ?? PB_ITINERARY_ICON_TYPE.UNDEFINED}
              transportationIconType={content.travelMode ?? PB_ITINERARY_TRAVELMODE_TYPE.UNKNOWN}
              title={content.title ?? ""}
              transportationText={getTransportationTextLabel(
                {
                  travelMode: content.travelMode ?? PB_ITINERARY_TRAVELMODE_TYPE.UNKNOWN,
                  travelDuration: content.travelDuration,
                  travelDistanceInMeters: content.travelDistanceInMeters,
                },
                postbookingT
              )}
              text={content.text ?? ""}
              date={content.date ? toDateWithoutTimezone(new Date(content.date)) : undefined}
              withArrow={index === lastItemContentIndex && segmentIndex !== lastDaySegmentIndex}
              countryCode={content.iconAlpha2CountryCode || content.iconAlpha3CountryCode}
              productCards={content?.cards
                ?.filter(card => SUPPORTED_DAY_ITINERARY_CARDS.indexOf(card.cardType) !== -1)
                .map(card => constructPBProductCard(card, locale, false, postbookingT))}
            />
          ));
        })}
    </>
  );
};

const DayItinerary = memo(DayItineraryPure);

const PBTimeline = ({
  dayData,
  nextDayNumber,
}: {
  dayData?: PostBookingTypes.ItineraryDay;
  nextDayNumber?: number;
}) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const { getDayNavigationClientRoute } = useGetPBClientRoutes();

  return (
    <TimelineWrapper>
      {dayData && <DayItinerary day={dayData} />}
      {nextDayNumber && (
        <PBTimelineNavigationItem>
          <ClientLink clientRoute={getDayNavigationClientRoute(nextDayNumber, true)}>
            {postbookingT("View day {dayNumber}", { dayNumber: nextDayNumber })}
          </ClientLink>
        </PBTimelineNavigationItem>
      )}
    </TimelineWrapper>
  );
};

export default PBTimeline;
