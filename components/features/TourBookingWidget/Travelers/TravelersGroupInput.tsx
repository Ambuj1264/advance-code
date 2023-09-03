import React, { memo } from "react";

import { getAgeText } from "./utils/travelersUtils";

import IncrementPicker from "components/ui/Inputs/IncrementPicker";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

type Props = {
  priceGroup: TravelersTypes.PriceGroup;
  numberOfTravelerType: number;
  pricePerTraveler?: number;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  className?: string;
  singlePriceGroup?: boolean;
  canIncrement?: boolean;
};

const TravelersGroupInput = ({
  priceGroup,
  numberOfTravelerType,
  onNumberOfTravelersChange,
  pricePerTraveler,
  className,
  singlePriceGroup = false,
  canIncrement = true,
}: Props) => {
  const { travelerType, minAge, maxAge, defaultNumberOfTravelerType } = priceGroup;
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const ageText = getAgeText(singlePriceGroup, travelerType, minAge, t, maxAge);
  const onChange = (number: number) => onNumberOfTravelersChange(travelerType, number);
  return (
    <IncrementPicker
      id={travelerType}
      canDecrement={numberOfTravelerType > defaultNumberOfTravelerType}
      canIncrement={canIncrement}
      count={numberOfTravelerType}
      title={ageText}
      price={pricePerTraveler}
      onChange={onChange}
      className={className}
      dataTestid={`traveller-${travelerType}`}
    />
  );
};

export default memo(TravelersGroupInput);
