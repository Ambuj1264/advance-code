import React, { useCallback } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { getSumOfValues } from "./utils/flightSearchWidgetUtils";
import PassengersPicker from "./PassengersPicker";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import ContentDropdown, {
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
} from "components/ui/Inputs/ContentDropdown";
import { singleLineTruncation, mqMin } from "styles/base";
import useToggle from "hooks/useToggle";
import TravelersIcon from "components/icons/travellers.svg";
import { gutters, borderRadiusSmall, whiteColor, greyColor } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

export const ContentDropdownStyled = styled(ContentDropdown)`
  margin: 0;
  border: 1px solid ${rgba(greyColor, 0.5)};
  border-radius: ${borderRadiusSmall};
  background-color: ${whiteColor};
  user-select: none;
  ${mqMin.large} {
    padding-right: ${gutters.small / 2}px;
    padding-left: ${gutters.small}px;
  }
  ${DropdownContentWrapper} {
    ${mqMin.large} {
      padding: ${gutters.small}px;
    }
  }
  ${DropdownContainer} {
    right: auto;
    left: -17px;
    min-width: 100%;
  }
  ${DisplayValue} {
    position: relative;
    margin: 0;
    border: none;
    height: 40px;
    padding: 0;
    background: none;
    ${mqMin.large} {
      height: 48px;
    }
  }
`;

const DisplayWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 0;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
`;

export const DisplayItemWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  color: ${greyColor};
`;

export const Item = styled.div`
  ${singleLineTruncation};
  display: block;
  margin-left: ${gutters.small / 2}px;
  width: 100%;
  padding-left: ${gutters.small / 2}px;
`;

export const StyledTravelersIcon = styled(TravelersIcon)(
  ({ theme }) => css`
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

export const PassengersDisplay = ({
  totalNumberOfPassengers,
  hasLongTitle,
  customTitle,
}: {
  totalNumberOfPassengers: number;
  hasLongTitle: boolean;
  customTitle?: string;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const title = hasLongTitle
    ? customTitle ||
      t("{totalPassengers} passengers", {
        totalPassengers: totalNumberOfPassengers,
      })
    : totalNumberOfPassengers;
  return (
    <DisplayWrapper>
      <DisplayItemWrapper>
        <StyledTravelersIcon />
        <Item>{title}</Item>
      </DisplayItemWrapper>
    </DisplayWrapper>
  );
};

const PassengersContainer = ({
  id,
  passengers,
  onNumberOfPassengersChange,
  onClick,
  hasLongTitle = false,
  customTitle = "",
  shouldDisplayArrowIcon = false,
  className,
  onOpenStateChange,
}: {
  id: string;
  passengers: FlightSearchTypes.Passengers;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  onClick?: () => void;
  hasLongTitle?: boolean;
  customTitle?: string;
  shouldDisplayArrowIcon?: boolean;
  className?: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  const isMobile = useIsMobile();
  const [isOpen, toggleIsOpen] = useToggle(false);

  const toggleIsOpenCb = useCallback(() => {
    toggleIsOpen();
    onOpenStateChange?.(!isOpen);
  }, [isOpen, onOpenStateChange, toggleIsOpen]);

  const onOutsideClickHandler = useCallback(() => {
    if (!isOpen) return;
    toggleIsOpenCb();
  }, [isOpen, toggleIsOpenCb]);

  const totalNumberOfPassengers = getSumOfValues(passengers);

  return (
    <ContentDropdownStyled
      id={id}
      className={className}
      displayValue={
        <PassengersDisplay
          totalNumberOfPassengers={totalNumberOfPassengers}
          hasLongTitle={hasLongTitle}
          customTitle={customTitle}
        />
      }
      isContentOpen={isOpen}
      toggleContent={isMobile && onClick ? onClick : toggleIsOpenCb}
      shouldDisplayArrowIcon={shouldDisplayArrowIcon}
      onOutsideClick={onOutsideClickHandler}
    >
      <PassengersPicker
        passengers={passengers}
        onNumberOfPassengersChange={onNumberOfPassengersChange}
        totalNumberOfPassengers={totalNumberOfPassengers}
      />
    </ContentDropdownStyled>
  );
};

export default PassengersContainer;
