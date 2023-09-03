import React from "react";
import styled from "@emotion/styled";

import BaseIncrementPicker from "../IncrementPicker";

import ChildrenAges from "./ChildrenAges";
import { getMinMaxChildrenAges, getTravellersCount } from "./utils";

import {
  checkIfCanIncrement,
  getTotalNumberOfGTIVpTravelers,
} from "components/features/TourBookingWidget/Travelers/utils/travelersUtils";
import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const ExpandedInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IncrementPicker = styled(BaseIncrementPicker)`
  & + & {
    margin-top: ${gutters.large}px;
  }
`;

const defaultGuestsGroups: SharedTypes.GuestGroup[] = [
  {
    id: "adults",
    defaultNumberOfType: 2,
    type: "adults",
  },
  {
    id: "children",
    defaultNumberOfType: 0,
    type: "children",
  },
];

const TravellerGroups = ({
  className,
  guestGroups = defaultGuestsGroups,
  numberOfGuests,
  onSetNumberOfGuests,
  updateChildrenAges,
  namespace,
  priceGroups,
  maxTravelers,
}: {
  className?: string;
  guestGroups?: SharedTypes.GuestGroup[];
  numberOfGuests: SharedTypes.NumberOfGuests;
  onSetNumberOfGuests: (type: SharedTypes.TravelerType, number: number) => void;
  updateChildrenAges?: (value: number, index: number) => void;
  namespace: Namespaces;
  priceGroups?: TravelersTypes.PriceGroup[];
  maxTravelers?: number;
}) => {
  const { t } = useTranslation(namespace);
  const canSelectChildrenAges = Boolean(updateChildrenAges && numberOfGuests?.children?.length > 0);
  const onTravellerPickerChange = (type: SharedTypes.TravelerType) => (number: number) => {
    onSetNumberOfGuests(type, number);
  };
  const { minAge, maxAge } = getMinMaxChildrenAges(priceGroups);

  const getPickerTitle = (type: SharedTypes.GuestType) => {
    if (type === "adults") {
      return t("Adults");
    }

    const childrenLabel = t("Children");

    return maxAge
      ? `${t("{travelerType} aged {minAge} - {maxAge}", {
          travelerType: childrenLabel,
          minAge,
          maxAge,
        })}`
      : childrenLabel;
  };

  const totalTravellers = getTotalNumberOfGTIVpTravelers({
    adults: numberOfGuests.adults,
    childrenAges: numberOfGuests.children,
  });
  const canIncrement = checkIfCanIncrement({ maxTravelers, totalTravellers });

  return (
    <ExpandedInputContainer className={className}>
      {guestGroups.map(({ id, type, defaultNumberOfType }) => {
        const count = getTravellersCount(numberOfGuests, type!);

        return (
          <IncrementPicker
            key={id}
            id={id}
            canDecrement={count > defaultNumberOfType}
            canIncrement={canIncrement}
            count={count}
            title={getPickerTitle(type)}
            onChange={onTravellerPickerChange(type)}
            dataTestid={`travellers-${type}`}
          />
        );
      })}
      {canSelectChildrenAges && (
        <ChildrenAges
          childrenAges={numberOfGuests.children}
          updateChildrenAges={updateChildrenAges!}
          namespace={namespace}
          minAge={minAge}
          maxAge={maxAge}
        />
      )}
    </ExpandedInputContainer>
  );
};

export default TravellerGroups;
