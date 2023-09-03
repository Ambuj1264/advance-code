import React, { useMemo } from "react";
import { StringParam, useQueryParams } from "use-query-params";

import { MaxWidthWrapper } from "./components/MaxWidthWrapper";
import {
  StyledContainer,
  StyledProductCardsRowWrapper,
  StyledReservationsTitle,
  TravelplanContentWrapper,
  PBHeading,
} from "./components/PBSharedComponents";
import { PBError } from "./components/PBError";
import { useFetchUserReservations } from "./hooks/useFetchUserReservations";
import PBTravelPlanReservationCard from "./PBTravelPlanReservationCard";
import { PostBookingTypes } from "./types/postBookingTypes";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useClientSideRedirect } from "hooks/useRedirect";
import { getClientSideUrl } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { PageType } from "types/enums";
import PBTravelPlanBuyCTA from "components/features/PostBooking/PBTravelPlanBuyCTA";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";

const PBVacationPackages = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();

  const { data, loading, error } = useFetchUserReservations();

  const allVPBookingCards = useMemo(
    () =>
      (data?.userReservations.vacationPackages || [])
        .map(vacationPackage => vacationPackage.card)
        .filter(Boolean) as PostBookingTypes.ItineraryCard[],
    [data]
  );

  const nonExpiredVPCards = useMemo(
    () => allVPBookingCards.filter(card => card.isExpired === false),
    [allVPBookingCards]
  );

  const [{ trip }] = useQueryParams({
    trip: StringParam,
  });

  const shouldRedirectToTravelplan = nonExpiredVPCards.length === 1;

  useClientSideRedirect({
    to: PageType.GTE_POST_BOOKING,
    as: `${getClientSideUrl(
      PageType.GTE_POST_BOOKING,
      activeLocale,
      marketplace
    )}?nav=travelplan&day=1&tripId=${nonExpiredVPCards[0]?.bookingId}`,
    condition: shouldRedirectToTravelplan,
  });

  if (loading || shouldRedirectToTravelplan) return <DefaultPageLoading />;

  if (nonExpiredVPCards.length === 0) {
    return <PBTravelPlanBuyCTA />;
  }

  if (error) {
    return <PBError error={error} />;
  }

  return (
    <TravelplanContentWrapper>
      <StyledContainer>
        <MaxWidthWrapper>
          <StyledProductCardsRowWrapper>
            {trip ? (
              <PBHeading>{postbookingT(`Congratulations, you just booked a ${trip}.`)}</PBHeading>
            ) : (
              <StyledReservationsTitle>{postbookingT("My trips")}</StyledReservationsTitle>
            )}
            {nonExpiredVPCards.map(vpCard => (
              <PBTravelPlanReservationCard key={vpCard.id} card={vpCard} />
            ))}
          </StyledProductCardsRowWrapper>
        </MaxWidthWrapper>
      </StyledContainer>
    </TravelplanContentWrapper>
  );
};

export default PBVacationPackages;
