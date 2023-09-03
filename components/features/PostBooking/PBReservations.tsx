import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TravelplanMobileModalWrapper from "./components/TravelplanMobileModalWrapper";
import { filterReservations, normalizedCardsData } from "./utils/postBookingUtils";
import { usePostBookingQueryParams } from "./components/hooks/usePostBookingQueryParams";
import { MaxWidthWrapper } from "./components/MaxWidthWrapper";
import {
  StyledContainer,
  StyledProductCardsRowWrapper,
  TravelplanContentWrapper,
} from "./components/PBSharedComponents";
import PBReservationsLoading from "./components/PBLoadingSkeletons/PBReservationsLoading";
import { useFetchUserReservations } from "./hooks/useFetchUserReservations";
import PBReservationsCards from "./PBReservationsCards";
import PBReservationsBuyCTA from "./PBReservationsBuyCTA";
import PBReservationsMainNavLink from "./PBReservationsMainNavLink";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";

const StyledPBReservationsMainNavLink = styled(PBReservationsMainNavLink)(
  () => css`
    display: none;
    ${mqMin.large} {
      display: block;
    }
  `
);

const PBReservations = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  const [{ tripId }] = usePostBookingQueryParams();

  const { data, loading } = useFetchUserReservations();

  // future reference:
  // when we have more filters like : filter by VP / stay / cars
  // they should be put within this function
  const filteredReservations = useMemo(() => filterReservations(data, tripId), [data, tripId]);

  const reservations = useMemo(
    () => normalizedCardsData(filteredReservations),
    [filteredReservations]
  );

  if (loading) return <PBReservationsLoading t={postbookingT} />;

  // TODO: what to display when you don't have reservations ?
  if (reservations.length === 0) {
    return <PBReservationsBuyCTA />;
  }

  const hasTripId = tripId !== undefined;

  const MaybeWithModalWrapper = hasTripId ? TravelplanMobileModalWrapper : React.Fragment;

  return (
    <MaybeWithModalWrapper pageTitle={postbookingT("Reservations")}>
      <TravelplanContentWrapper>
        <StyledContainer>
          {hasTripId && <StyledPBReservationsMainNavLink />}
          <MaxWidthWrapper>
            <PBReservationsCards reservations={reservations} hasTripId={hasTripId} />
            <StyledProductCardsRowWrapper />
          </MaxWidthWrapper>
        </StyledContainer>
      </TravelplanContentWrapper>
    </MaybeWithModalWrapper>
  );
};

export default PBReservations;
