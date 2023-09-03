import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { useMediaQuery } from "react-responsive";
import { css } from "@emotion/core";

import {
  checkIfCanIncrement,
  getTotalNumberOfTravelersWithPriceGroups,
  getTotalNumberOfGTIVpTravelers,
} from "./utils/travelersUtils";
import BaseTravelersGroupInput from "./TravelersGroupInput";

import ContentDropdown from "components/ui/Inputs/ContentDropdown";
import { gutters, breakpointsMax } from "styles/variables";
import useToggle from "hooks/useToggle";
import Travelers from "components/icons/travellers.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const Wrapper = styled.div`
  margin: 0 -${gutters.large}px;
`;

const TravelersIcon = styled(Travelers)(({ theme }) => [
  css`
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
  `,
]);

const ExpandedInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TravelersGroupInput = styled(BaseTravelersGroupInput)`
  :not(:first-of-type) {
    margin-top: ${gutters.large}px;
  }
`;

const TravelInputContent = ({
  priceGroups,
  numberOfTravelers,
  travelerPrices,
  onNumberOfTravelersChange,
  canIncrement,
  className,
}: {
  priceGroups: TravelersTypes.PriceGroup[];
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  canIncrement: boolean;
  className?: string;
}) => (
  <ExpandedInputContainer className={className}>
    {priceGroups.map(priceGroup => (
      <TravelersGroupInput
        key={priceGroup.id}
        numberOfTravelerType={numberOfTravelers[priceGroup.travelerType]}
        priceGroup={priceGroup}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        pricePerTraveler={travelerPrices?.[priceGroup.travelerType]}
        singlePriceGroup={priceGroups.length === 1}
        canIncrement={canIncrement}
      />
    ))}
  </ExpandedInputContainer>
);
const TravelersInput = ({
  priceGroups,
  numberOfTravelers,
  onNumberOfTravelersChange,
  travelerPrices,
  className,
  maxTravelers,
  onInputClick,
  canOpenDropdown = true,
  showAsDropdown = false,
  isLivePricing,
  childrenAges = [],
}: {
  priceGroups: TravelersTypes.PriceGroup[];
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  className?: string;
  maxTravelers?: number;
  onInputClick?: () => void;
  canOpenDropdown?: boolean;
  showAsDropdown?: boolean;
  isLivePricing?: boolean;
  childrenAges?: number[];
}) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const [isTravelersOpen, toggleTravelers] = useToggle(false);
  const totalTravellers = isLivePricing
    ? getTotalNumberOfGTIVpTravelers({
        adults: numberOfTravelers.adults,
        childrenAges,
      })
    : getTotalNumberOfTravelersWithPriceGroups(numberOfTravelers, priceGroups);
  const canIncrement = checkIfCanIncrement({ maxTravelers, totalTravellers });
  const onOutsideClick = useCallback(
    () => isTravelersOpen && toggleTravelers(),
    [isTravelersOpen, toggleTravelers]
  );

  if (!showAsDropdown && isMobile) {
    return (
      <TravelInputContent
        priceGroups={priceGroups}
        numberOfTravelers={numberOfTravelers}
        travelerPrices={travelerPrices}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        canIncrement={canIncrement}
        className={className}
      />
    );
  }

  return (
    <Wrapper className={className}>
      <ContentDropdown
        id="travelers"
        inputLabel={t("Travellers")}
        displayValue={
          <>
            <TravelersIcon />
            {commonT("{totalTravellers} travellers", {
              totalTravellers,
            })}
          </>
        }
        isContentOpen={canOpenDropdown && isTravelersOpen}
        onOutsideClick={canOpenDropdown ? onOutsideClick : undefined}
        toggleContent={onInputClick || toggleTravelers}
      >
        <TravelInputContent
          priceGroups={priceGroups}
          numberOfTravelers={numberOfTravelers}
          travelerPrices={travelerPrices}
          onNumberOfTravelersChange={onNumberOfTravelersChange}
          canIncrement={canIncrement}
        />
      </ContentDropdown>
    </Wrapper>
  );
};

export default TravelersInput;
