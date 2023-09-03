import React from "react";
import styled from "@emotion/styled";

import TravellerGroups from "components/ui/Inputs/TravellerPicker/TravellerGroups";
import { gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { Trans } from "i18n";

const TravellerGroupsStyled = styled(TravellerGroups)`
  margin-top: ${gutters.small}px;
`;

const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  margin-top: ${gutters.small}px;
`;
const defaultGuestGroups: SharedTypes.GuestGroup[] = [
  {
    id: "adults",
    defaultNumberOfType: 1,
    type: "adults",
  },
  {
    id: "children",
    defaultNumberOfType: 0,
    type: "children",
  },
];

const MobileStepTravellers = ({
  onSetNumberOfGuests,
  updateChildrenAges,
  namespace,
  numberOfGuests,
  guestGroups = defaultGuestGroups,
}: {
  namespace: Namespaces;
  onSetNumberOfGuests: (type: SharedTypes.TravelerType, number: number) => void;
  updateChildrenAges?: (value: number, index: number) => void;
  numberOfGuests: SharedTypes.NumberOfGuests;
  guestGroups?: SharedTypes.GuestGroup[];
}) => {
  return (
    <>
      <StyledMobileSectionHeading>
        <Trans ns={Namespaces.tourSearchNs}>Travellers</Trans>
      </StyledMobileSectionHeading>
      <TravellerGroupsStyled
        numberOfGuests={numberOfGuests}
        onSetNumberOfGuests={onSetNumberOfGuests}
        namespace={namespace}
        guestGroups={guestGroups}
        updateChildrenAges={updateChildrenAges}
      />
    </>
  );
};

export default MobileStepTravellers;
