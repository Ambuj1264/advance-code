import React, { ReactNode, useCallback, useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FlightLocationPicker from "../FlightSearchWidget/FlightLocationPicker";
import { ArrowIcon, DisplayValue, DropdownContainer } from "../Inputs/ContentDropdown";

import { StyledContentDropdown } from "./BookingWidgetDropdown";

import { useModalHistoryContext } from "contexts/ModalHistoryContext";
import {
  AutocompleteInputHalf,
  ClearWrapper,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { mqMin } from "styles/base";
import { Wrapper as InputWrapper } from "components/ui/Inputs/Input";
import { greyColor, gutters } from "styles/variables";
import { FlightFunnelType } from "types/enums";
import { VPActionCallbackContext } from "components/features/VacationPackageProductPage/contexts/VPActionStateContext";

const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const AutocompleteInputHalfStyled = styled(AutocompleteInputHalf)`
  ${InputWrapper} {
    ${mqMin.large} {
      height: 45px;
      line-height: 45px;
    }
  }
  &:nth-of-type(2) {
    ${ClearWrapper} {
      display: none;
    }
  }
`;

const StyledContentDropdownNoInputsBorder = styled(StyledContentDropdown)<{}>(
  ({ theme }) => `
  ${DisplayValue} {
    border: none;
  }
  ${ArrowIcon} {
    display: none;
  }

  ${DropdownContainer} {
    top: 50px;
    border-color: ${theme.colors.primary};
    ${mqMin.large} {
      width: 100%;
    }
  }
`
);

const StyledFlightLocationPicker = styled(FlightLocationPicker)<{}>(
  ({ theme }) => css`
    svg {
      fill: ${theme.colors.primary};
      ${mqMin.large} {
        margin-left: 10px;
      }
    }

    ${ClearWrapper} {
      padding: 0;
      svg {
        fill: ${greyColor};
      }
    }
  `
);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const BookingWidgetDropdownFlightLocationPicker = ({
  className,
  isSelected,
  isDisabled,
  destinationName,
  originId,
  originName,
  children,
  onOpenStateChange,
  isOpen,
  autocompleteFunnel = FlightFunnelType.FLIGHT,
  originInputRef,
}: {
  className?: string;
  isSelected: boolean;
  isDisabled?: boolean;
  destinationName?: string;
  originId?: string;
  originName?: string;
  children?: ReactNode;
  onOpenStateChange?: BookingWidgetTypes.onOpenStateChange["onOpenStateChange"];
  isOpen?: boolean;
  autocompleteFunnel?: FlightFunnelType;
  originInputRef: React.MutableRefObject<VacationPackageTypes.originInputRef>;
}) => {
  const { currentId } = useModalHistoryContext();
  const [isOriginDisabled, setIsOriginDisabled] = useState(
    Boolean(!isDisabled || originId || originName)
  );
  useEffect(() => {
    setIsOriginDisabled(Boolean(!isDisabled || originId || originName));
  }, [isDisabled, originId, originName]);
  const { onVPOriginLocationChange } = useContext(VPActionCallbackContext);
  const toggleIsContentOpen = useCallback(() => {
    onOpenStateChange?.(!isOpen);
  }, [onOpenStateChange, isOpen]);

  const onToggleFlightsSelection = useCallback(() => {
    if (isOriginDisabled && !isDisabled) {
      toggleIsContentOpen();
      onOpenStateChange?.(!isOpen);
    }
  }, [isDisabled, isOpen, isOriginDisabled, onOpenStateChange, toggleIsContentOpen]);
  const onLocationClick = useCallback(onToggleFlightsSelection, [onToggleFlightsSelection]);
  const onOriginLocationChangeHandler = useCallback(
    (newOriginId?: string, newOriginName?: string, newCountryCode?: string) => {
      // handle onClear
      if (!newOriginId) {
        setIsOriginDisabled(false);
      } else {
        setIsOriginDisabled(true);
      }
      onVPOriginLocationChange(newOriginId, newOriginName, newCountryCode);
      if (isOpen) {
        toggleIsContentOpen();
      }
      onOpenStateChange?.(false);
    },
    [isOpen, onOpenStateChange, onVPOriginLocationChange, toggleIsContentOpen]
  );
  const onOutsideClickHandler = useCallback(() => {
    if (isOpen && !currentId) {
      onToggleFlightsSelection();
    }
  }, [isOpen, onToggleFlightsSelection, currentId]);
  const onOpenDropdown = useCallback(() => {
    onOpenStateChange?.(true);
  }, [onOpenStateChange]);
  const onCloseDropdown = useCallback(() => {
    onOpenStateChange?.(false);
  }, [onOpenStateChange]);

  return (
    <DropdownWrapper data-testid="flightLocationPickerSmall">
      <StyledContentDropdownNoInputsBorder
        className={className}
        id="bookingWidgetFlightDropdown"
        displayValue={
          <StyledFlightLocationPicker
            id="flightLocationPickerSmall"
            isDestinationDisabled
            isOriginDisabled={isOriginDisabled}
            AutocompleteComponent={AutocompleteInputHalfStyled}
            onOriginLocationChange={onOriginLocationChangeHandler}
            onDestinationLocationChange={noop}
            onOriginLocationClick={onLocationClick}
            onDestinationLocationClick={onLocationClick}
            origin={originName}
            destination={destinationName}
            onCloseDropdown={onCloseDropdown}
            onOpenDropdown={onOpenDropdown}
            autocompleteFunnel={autocompleteFunnel}
            originInputRef={originInputRef}
          />
        }
        isContentOpen={Boolean(isOpen)}
        onOutsideClick={onOutsideClickHandler}
        toggleContent={onToggleFlightsSelection}
        isSelected={isSelected}
      >
        {children}
      </StyledContentDropdownNoInputsBorder>
    </DropdownWrapper>
  );
};

export default BookingWidgetDropdownFlightLocationPicker;
