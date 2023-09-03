import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PBProductCard } from "./components/PBProductCards";
import { StyledPBProductCardsWrapper, StyledProductCardRow } from "./components/PBSharedComponents";
import { PostBookingTypes } from "./types/postBookingTypes";
import { constructPBProductCard } from "./utils/postBookingCardUtils";

import { Namespaces } from "shared/namespaces";
import useActiveLocale from "hooks/useActiveLocale";

/**
 *
 * Displays a list of standalone user reservations
 * that are not a part of vacation package
 * e.g. flights / cars / stays
 */

const PBReservationsStandaloneCards = ({
  reservationCards,
}: {
  reservationCards: PostBookingTypes.ItineraryCard[] | PostBookingTypes.ItineraryCard;
}) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const activeLocale = useActiveLocale();
  const streetViewEnabled = false;

  const cards = useMemo(
    () => (Array.isArray(reservationCards) ? reservationCards : [reservationCards]),
    [reservationCards]
  );

  const productCards = useMemo(
    () =>
      cards.map(reservation =>
        constructPBProductCard(reservation, activeLocale, streetViewEnabled, postbookingT)
      ),
    [activeLocale, postbookingT, cards, streetViewEnabled]
  );

  return productCards ? (
    <>
      {productCards.map(product => (
        <StyledPBProductCardsWrapper key={product.id}>
          <StyledProductCardRow>
            <PBProductCard product={product} />
          </StyledProductCardRow>
        </StyledPBProductCardsWrapper>
      ))}
    </>
  ) : null;
};

export default PBReservationsStandaloneCards;
