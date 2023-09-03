import React, { SyntheticEvent } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import TravellerGroups from "./TravellerGroups";

import { Namespaces } from "shared/namespaces";
import { gutters, greyColor, whiteColor, borderRadiusSmall } from "styles/variables";
import ContentDropdown, { DisplayValue } from "components/ui/Inputs/ContentDropdown";
import useToggle from "hooks/useToggle";
import Travelers from "components/icons/travellers.svg";
import { Trans } from "i18n";
import { mqMin } from "styles/base";

const Wrapper = styled.div`
  user-select: none;
`;

export const ContentDropdownStyled = styled(ContentDropdown)`
  margin: 0;
  border: 1px solid ${rgba(greyColor, 0.5)};
  border-radius: ${borderRadiusSmall};
  padding: 0;
  background-color: ${whiteColor};

  ${mqMin.large} {
    padding: 0;
  }

  ${DisplayValue} {
    margin: 0;
    border: none;
    height: 40px;
    padding-right: 8px;
    background: none;
  }
`;

export const TravelersIcon = styled(Travelers)(
  ({ theme }) => css`
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

export const DisplayValueWrapper = styled.span`
  display: flex;
  width: 100%;
  padding-left: ${gutters.small - 4}px;
  white-space: nowrap;
`;

const DisplayWrapper = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const DisplayValueItem = styled.span`
  display: block;
  margin-right: ${gutters.small * 2}px;
  :first-of-type {
    list-style-type: none;
  }
`;

export const DEFAULT_TRAVELER_AMOUNT = 2;

export type TravellerPickerProps = {
  className?: string;
  numberOfGuests: SharedTypes.NumberOfGuests;
  guestGroups?: SharedTypes.GuestGroup[];
  onSetNumberOfGuests: (type: SharedTypes.TravelerType, number: number) => void;
  onInputClick?: (e: SyntheticEvent) => void;
  updateChildrenAges?: (value: number, index: number) => void;
  namespace: Namespaces;
  disabled?: boolean;
  isOpen?: boolean;
  id?: string;
  priceGroups?: TravelersTypes.PriceGroup[];
  maxTravelers?: number;
};
const TravellerPicker = ({
  id = "travelers",
  className,
  onInputClick,
  numberOfGuests,
  guestGroups,
  onSetNumberOfGuests,
  updateChildrenAges,
  namespace,
  disabled = false,
  isOpen = false,
  priceGroups,
  maxTravelers,
}: TravellerPickerProps) => {
  const [isTravelersOpen, toggleTravelers] = useToggle(isOpen);
  const adjustedNumberOfGuests = {
    adults: numberOfGuests.adults || DEFAULT_TRAVELER_AMOUNT,
    children: numberOfGuests.children ?? [],
  };
  const totalGuests = adjustedNumberOfGuests.adults + adjustedNumberOfGuests.children.length;

  return (
    <Wrapper className={className}>
      <ContentDropdownStyled
        id={`${id}TravellerPicker`}
        displayValue={
          <DisplayWrapper onClick={onInputClick}>
            <TravelersIcon />
            <DisplayValueWrapper>
              <DisplayValueItem>
                <Trans
                  ns={Namespaces.commonNs}
                  i18nKey="{totalTravellers} travellers"
                  defaults="{totalTravellers} travellers"
                  values={{ totalTravellers: totalGuests }}
                />
              </DisplayValueItem>
            </DisplayValueWrapper>
          </DisplayWrapper>
        }
        isContentOpen={isTravelersOpen}
        onOutsideClick={() => isTravelersOpen && toggleTravelers()}
        toggleContent={() => {
          if (!disabled) toggleTravelers();
        }}
      >
        <TravellerGroups
          numberOfGuests={adjustedNumberOfGuests}
          namespace={namespace}
          onSetNumberOfGuests={onSetNumberOfGuests}
          updateChildrenAges={updateChildrenAges}
          guestGroups={guestGroups}
          priceGroups={priceGroups}
          maxTravelers={maxTravelers}
        />
      </ContentDropdownStyled>
    </Wrapper>
  );
};

export default TravellerPicker;
