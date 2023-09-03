import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  StyledProductCardsRowWrapper,
  StyledReservationsTitle,
} from "./components/PBSharedComponents";
import PBReservationsStandaloneCards from "./PBReservationsStandaloneCards";
import PBTravelPlanReservationCard from "./PBTravelPlanReservationCard";
import { PB_CARD_TYPE } from "./types/postBookingEnums";
import { PostBookingTypes } from "./types/postBookingTypes";
import { getTitleLabel } from "./utils/pbCardLabelConstructionUtils";
import { splitForToggle } from "./utils/postBookingUtils";
import PBReservationsToggle, { usePBReservationsToggle } from "./components/PBReservationsToggle";
import PBReservationsBuyCTA from "./PBReservationsBuyCTA";

import { Namespaces } from "shared/namespaces";

const PBReservationCard = ({
  reservation,
  isActive,
}: {
  reservation: PostBookingTypes.NormalizedReservationCard;
  isActive: boolean;
}) => {
  const isVacationPackageMainReservationCard =
    reservation.mainReservationCard?.cardType === PB_CARD_TYPE.VACATION_PACKAGE;

  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  const { mainReservationCard, title, subReservations } = reservation;

  if (!mainReservationCard) return null;

  return (
    <>
      <StyledReservationsTitle>
        {isVacationPackageMainReservationCard
          ? postbookingT(isActive ? "Reservations for {title}" : "Previous order for {title}", {
              title,
            })
          : getTitleLabel(mainReservationCard, postbookingT)}
      </StyledReservationsTitle>

      {subReservations.length === 0 &&
        (isVacationPackageMainReservationCard ? (
          <PBTravelPlanReservationCard card={mainReservationCard} />
        ) : (
          <PBReservationsStandaloneCards reservationCards={mainReservationCard} />
        ))}
      {/* if it's a vacation package and it has sub-reservations - all sub-reservation cards with reference to travelplan */}
      {isVacationPackageMainReservationCard && subReservations.length > 0 && (
        <>
          <PBReservationsStandaloneCards reservationCards={subReservations} />
          {isActive && (
            <PBTravelPlanReservationCard card={mainReservationCard} skipReservationLink />
          )}
        </>
      )}
    </>
  );
};

const PBReservationsCards = ({
  reservations,
  hasTripId,
}: {
  reservations: PostBookingTypes.NormalizedReservationCard[];
  hasTripId: boolean;
}) => {
  const { active, inactive } = useMemo(() => splitForToggle(reservations), [reservations]);

  // in trip context - we should switch to inavtive reservations if there're no active
  // otherwise - we always display "upcoming" reservations
  const defaultTogglePosition = hasTripId ? Boolean(hasTripId && active.length > 0) : true;

  const { checked, onChange } = usePBReservationsToggle(defaultTogglePosition);

  const reservationsToDisplay = checked ? active : inactive;

  return (
    <>
      {inactive.length > 0 && <PBReservationsToggle onChange={onChange} checked={checked} />}
      {!hasTripId && active.length === 0 && checked && <PBReservationsBuyCTA />}
      {reservationsToDisplay.map(reservation => (
        <StyledProductCardsRowWrapper
          key={reservation.mainReservationCard?.id || reservation.subReservations?.[0]?.id}
        >
          <PBReservationCard isActive={checked} reservation={reservation} />
        </StyledProductCardsRowWrapper>
      ))}
    </>
  );
};

export default memo(PBReservationsCards);
