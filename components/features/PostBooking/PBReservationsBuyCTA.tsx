import React from "react";
import { useTranslation } from "react-i18next";

import {
  StyledContainer,
  TravelplanContentWrapper,
  PBHeading,
} from "./components/PBSharedComponents";

import { MaxWidthWrapper } from "components/features/PostBooking/components/MaxWidthWrapper";
import { Namespaces } from "shared/namespaces";
import { PBProductReservationCardEmpty } from "components/features/PostBooking/components/PBProductReservationCardEmpty";

const PBReservationsBuyCTA = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  return (
    <TravelplanContentWrapper>
      <StyledContainer>
        <MaxWidthWrapper>
          <PBHeading>
            {postbookingT(
              "You have no upcoming reservations. Book your trip to see all your reservations in one place."
            )}
          </PBHeading>
        </MaxWidthWrapper>
        <PBProductReservationCardEmpty />
      </StyledContainer>
    </TravelplanContentWrapper>
  );
};

export default PBReservationsBuyCTA;
