import React from "react";

import MobileStepLocation from "./MobileStepLocation";
import MobileStepTravellers from "./MobileStepTravellers";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const MobileStepLocationAndTravellers = ({
  startingLocationItems,
  onInputChange,
  onItemClick,
  locationPlaceholder,
  locationLabel,
  locationDefaultValue,
  namespace,
  numberOfGuests,
  onSetNumberOfGuests,
  updateChildrenAges,
  guestGroups,
  forceLocationFocus,
}: {
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onItemClick: (item?: SharedTypes.AutocompleteItem | undefined) => void;
  locationPlaceholder?: string;
  locationLabel: string;
  locationDefaultValue?: string;
  namespace: Namespaces;
  numberOfGuests: SharedTypes.NumberOfGuests;
  onSetNumberOfGuests: (type: SharedTypes.TravelerType, number: number) => void;
  updateChildrenAges?: (value: number, index: number) => void;
  guestGroups?: SharedTypes.GuestGroup[];
  forceLocationFocus?: boolean;
}) => {
  return (
    <>
      <MobileSectionHeading>
        <Trans ns={Namespaces.tourSearchNs}>Select details</Trans>
      </MobileSectionHeading>
      <MobileStepLocation
        startingLocationItems={startingLocationItems}
        onInputChange={onInputChange}
        onItemClick={onItemClick}
        locationPlaceholder={locationPlaceholder}
        label={locationLabel}
        defaultValue={locationDefaultValue}
        forceFocus={forceLocationFocus}
      />
      <MobileStepTravellers
        namespace={namespace}
        numberOfGuests={numberOfGuests}
        onSetNumberOfGuests={onSetNumberOfGuests}
        updateChildrenAges={updateChildrenAges}
        guestGroups={guestGroups}
      />
    </>
  );
};

export default MobileStepLocationAndTravellers;
