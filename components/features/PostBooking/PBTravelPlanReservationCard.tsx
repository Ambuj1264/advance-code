import React from "react";
import { useTranslation } from "react-i18next";

import { PBProductReservationCard } from "./components/PBProductReservationCard";
import { StyledPBProductCardsWrapper, StyledProductCardRow } from "./components/PBSharedComponents";
import { useGetPBClientRoutes } from "./hooks/useGetPBClientRoutes";
import { PB_CARD_TYPE } from "./types/postBookingEnums";
import { PostBookingTypes } from "./types/postBookingTypes";
import { constructPBProductVacationCard, getPBCardIcon } from "./utils/postBookingCardUtils";

import { Namespaces } from "shared/namespaces";
import useActiveLocale from "hooks/useActiveLocale";

const PBTravelPlanReservationCard = ({
  card,
  skipReservationLink = false,
}: {
  card: PostBookingTypes.ItineraryCard;
  skipReservationLink?: boolean;
}) => {
  const { getReservationsClientRoute, getTravelplanClientRoute } = useGetPBClientRoutes();

  const activeLocale = useActiveLocale();
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  const vpCard = constructPBProductVacationCard(card, activeLocale, postbookingT);
  const reservationsClientRoute = skipReservationLink
    ? undefined
    : getReservationsClientRoute({
        tripId: card.bookingId ?? 0,
      });
  const travelplanClientRoute = getTravelplanClientRoute({
    tripId: card.bookingId ?? 0,
  });
  return (
    <StyledProductCardRow key={card.id}>
      <StyledPBProductCardsWrapper>
        <PBProductReservationCard
          isExpired={vpCard.isExpired}
          type={vpCard.type}
          image={vpCard.image}
          quickfacts={vpCard.quickfacts}
          rating={vpCard.rating}
          reviewsCount={vpCard.reviewsCount}
          heading={vpCard.heading}
          title={vpCard.title}
          id={vpCard.id}
          HeadingIcon={getPBCardIcon(PB_CARD_TYPE.TRAVELPLAN)}
          reservationsClientRoute={reservationsClientRoute}
          travelplanClientRoute={travelplanClientRoute}
        />
      </StyledPBProductCardsWrapper>
    </StyledProductCardRow>
  );
};

export default PBTravelPlanReservationCard;
