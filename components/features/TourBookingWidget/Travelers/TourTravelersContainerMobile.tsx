import React, { memo } from "react";
import styled from "@emotion/styled";

import TravellersHeaderMobile from "./TravellersHeaderMobile";

import TravellerGroups from "components/ui/Inputs/TravellerPicker/TravellerGroups";
import { frontGuestGroups } from "components/ui/FrontSearchWidget/utils/frontUtils";
import { Namespaces } from "shared/namespaces";
import { guttersPx } from "styles/variables";

const StyledTravellerGroups = styled(TravellerGroups)<{}>`
  margin-top: ${guttersPx.small};
`;

const TourTravelersContainerMobile = ({
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  numberOfGuests,
  priceGroups,
  maxTravelers,
}: {
  numberOfGuests: SharedTypes.NumberOfGuests;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange?: (value: number, index: number) => void;
  priceGroups: TravelersTypes.PriceGroup[];
  maxTravelers?: number;
}) => (
  <>
    <TravellersHeaderMobile />
    <StyledTravellerGroups
      numberOfGuests={numberOfGuests}
      namespace={Namespaces.tourBookingWidgetNs}
      onSetNumberOfGuests={onNumberOfTravelersChange}
      updateChildrenAges={onChildrenAgesChange}
      guestGroups={frontGuestGroups}
      priceGroups={priceGroups}
      maxTravelers={maxTravelers}
    />
  </>
);

export default memo(TourTravelersContainerMobile);
