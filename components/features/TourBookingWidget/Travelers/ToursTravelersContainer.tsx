import React, { memo, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useGetTravelersPriceGroups } from "../hooks/useGetTravelersPriceGroups";

import TravelersContainer from "./TravelersContainer";
import TourTravelersContainerMobile from "./TourTravelersContainerMobile";

import TravellerPicker, {
  ContentDropdownStyled,
  DisplayValueWrapper,
} from "components/ui/Inputs/TravellerPicker/TravellerPicker";
import { frontGuestGroups } from "components/ui/FrontSearchWidget/utils/frontUtils";
import { ArrowIcon, DisplayValue } from "components/ui/Inputs/ContentDropdown";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { blackColor, guttersPx } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const StyledTravellerPicker = styled(TravellerPicker)<{}>`
  margin-top: ${guttersPx.smallHalf};

  ${ContentDropdownStyled} ${DisplayValue} {
    height: 45px;
  }

  ${DisplayValueWrapper} {
    justify-content: center;
  }

  ${ArrowIcon} {
    margin-right: ${guttersPx.smallHalf};
    width: 20px;
  }
`;

export const Header = styled.div([
  typographyBody2,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const DropdownWrapper = styled.div`
  margin-top: ${guttersPx.smallHalf};
`;

const ToursTravelersContainer = ({
  id,
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  onSetTravelersPriceGroups,
  numberOfTravelers,
  childrenAges = [],
  onSetDefaultNumberOfTravelers,
  travelerPrices,
  hasSelectedDates,
  maxTravelers,
  isLivePricing,
  isMobile,
}: {
  id: number;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges?: number[];
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange?: (value: number, index: number) => void;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  hasSelectedDates: boolean;
  maxTravelers?: number;
  onSetTravelersPriceGroups?: (value: TravelersTypes.PriceGroup[]) => void;
  isLivePricing?: boolean;
  isMobile?: boolean;
}) => {
  const { isPriceGroupLoading, priceGroups, priceGroupsMaxAge, error } = useGetTravelersPriceGroups(
    {
      onSetDefaultNumberOfTravelers,
      onSetTravelersPriceGroups,
      numberOfTravelers,
      id,
      skipFetchingPriceGroups: !hasSelectedDates,
    }
  );

  const numberOfGuests = useMemo(
    () => ({
      adults: numberOfTravelers.adults,
      children: childrenAges,
    }),
    [childrenAges, numberOfTravelers.adults]
  );

  if (error) throw error;

  if (isLivePricing) {
    if (isMobile) {
      return (
        <TourTravelersContainerMobile
          numberOfGuests={numberOfGuests}
          onNumberOfTravelersChange={onNumberOfTravelersChange}
          onChildrenAgesChange={onChildrenAgesChange}
          priceGroups={priceGroups}
          maxTravelers={maxTravelers}
        />
      );
    }

    return (
      <DropdownWrapper>
        <Header>
          <Trans ns={Namespaces.tourBookingWidgetNs}>Travelers</Trans>
        </Header>
        <StyledTravellerPicker
          numberOfGuests={numberOfGuests}
          onSetNumberOfGuests={onNumberOfTravelersChange}
          updateChildrenAges={onChildrenAgesChange}
          guestGroups={frontGuestGroups}
          namespace={Namespaces.tourBookingWidgetNs}
          priceGroups={priceGroups}
          maxTravelers={maxTravelers}
        />
      </DropdownWrapper>
    );
  }

  return (
    <TravelersContainer
      numberOfTravelers={numberOfTravelers}
      onNumberOfTravelersChange={onNumberOfTravelersChange}
      travelerPrices={travelerPrices}
      maxTravelers={maxTravelers}
      priceGroupsMaxAge={priceGroupsMaxAge!}
      priceGroups={priceGroups}
      isPriceGroupLoading={isPriceGroupLoading}
    />
  );
};

export default memo(ToursTravelersContainer);
