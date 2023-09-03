import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getTotalTravelers } from "./utils/gteTourBookingWidgetUtils";
import GTETourTravelersInputContent from "./GTETourTravelersInputContent";
import { GTETourAgeBand } from "./types/enums";

import ContentDropdown, {
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
} from "components/ui/Inputs/ContentDropdown";
import { gutters, borderRadiusSmall, whiteColor, greyColor, redColor } from "styles/variables";
import useToggle from "hooks/useToggle";
import Travelers from "components/icons/travellers.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { singleLineTruncation, mqMin } from "styles/base";

export const ContentDropdownStyled = styled(ContentDropdown)<{
  isError: boolean;
}>(
  ({ theme, isError }) =>
    css`
      margin: 0;
      border: 1px solid ${isError ? redColor : theme.colors.primary};
      border-radius: ${borderRadiusSmall};
      background-color: ${whiteColor};
      user-select: none;
      ${mqMin.large} {
        padding-right: ${gutters.small}px;
        padding-left: 10px;
      }
      ${DropdownContentWrapper} {
        ${mqMin.large} {
          padding: ${gutters.small}px;
        }
      }
      ${DropdownContainer} {
        top: 50px;
        right: -16px;
        left: -10px;
        min-width: 100%;
        border-color: ${theme.colors.primary};
      }
      ${DisplayValue} {
        position: relative;
        margin: 0;
        border: none;
        height: 40px;
        padding: 0;
        background: none;
        ${mqMin.large} {
          height: 43px;
        }
      }
    `
);

export const DisplayItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  height: 100%;
  color: ${greyColor};
`;

export const TravelersIcon = styled(Travelers)(
  ({ theme }) => css`
    position: absolute;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

export const Item = styled.div`
  ${singleLineTruncation};
  display: flex;
  justify-content: center;
  margin: 0;
  width: 100%;
  padding: 0;
`;

const GTETourTravelersInput = ({
  priceGroups,
  numberOfTravelers,
  onNumberOfTravelersChange,
  onOpenStateChange,
  className,
  maxTravelersPerBooking,
  isError,
  canOpenDropdown = true,
  viewType = "dropdown",
}: {
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[];
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[];
  onNumberOfTravelersChange: (travelerType: GTETourAgeBand, value: number) => void;
  className?: string;
  maxTravelersPerBooking: number;
  isError: boolean;
  canOpenDropdown?: boolean;
  viewType?: "dropdown" | "list";
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const [isTravelersOpen, toggleTravelers] = useToggle(false);
  const totalTravellers = getTotalTravelers(numberOfTravelers);
  const isAtMaxCapacity = totalTravellers >= maxTravelersPerBooking;
  const toggleIsOpenCb = useCallback(() => {
    toggleTravelers();
    onOpenStateChange?.(!isTravelersOpen);
  }, [isTravelersOpen, onOpenStateChange, toggleTravelers]);
  const onOutsideClickHandler = useCallback(() => {
    if (!isTravelersOpen) return;
    toggleIsOpenCb();
  }, [isTravelersOpen, toggleIsOpenCb]);

  if (viewType === "list") {
    return (
      <GTETourTravelersInputContent
        priceGroups={priceGroups}
        numberOfTravelers={numberOfTravelers}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        isAtMaxCapacity={isAtMaxCapacity}
      />
    );
  }
  return (
    <ContentDropdownStyled
      id="travelers"
      className={className}
      isError={isError}
      displayValue={
        <DisplayItemWrapper>
          <TravelersIcon />
          <Item>
            {commonT("{totalTravellers} travellers", {
              totalTravellers,
            })}
          </Item>
        </DisplayItemWrapper>
      }
      isContentOpen={canOpenDropdown && isTravelersOpen}
      onOutsideClick={onOutsideClickHandler}
      toggleContent={toggleIsOpenCb}
    >
      <GTETourTravelersInputContent
        priceGroups={priceGroups}
        numberOfTravelers={numberOfTravelers}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        isAtMaxCapacity={isAtMaxCapacity}
      />
    </ContentDropdownStyled>
  );
};

export default GTETourTravelersInput;
