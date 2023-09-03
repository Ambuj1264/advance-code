import React, { useCallback, useMemo, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import {
  BookingWidgetExtra,
  BookingWidgetExtrasRow,
} from "components/ui/BookingWidget/BookingWidgetExtras";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import FlightTypeContainer from "components/ui/FlightSearchWidget/FlightTypeContainer";
import FlightFareCategoryContainer, {
  NoBackgroundDisplay,
} from "components/ui/FlightSearchWidget/FlightFareCategoryContainer";
import { DisplayWrapper, ContentDropdownStyled } from "components/ui/Inputs/RadioSelectionDropdown";
import { gutters, whiteColor } from "styles/variables";
import { DisplayValue, DropdownContainer, Wrapper } from "components/ui/Inputs/ContentDropdown";
import { skeletonPulse, skeletonPulseBlue } from "styles/base";
import { StyledBookingWidgetSectionHeading } from "components/ui/BookingWidget/BookingWidgetSectionHeader";

const StyledFlightTypeContainer = styled(FlightTypeContainer)<{
  isOnBookingWidget: boolean;
}>(
  ({ theme, isOnBookingWidget }) => css`
    margin-top: 0;

    ${DisplayWrapper} {
      height: auto;
      color: ${isOnBookingWidget ? theme.colors.primary : whiteColor};
    }

    ${DisplayValue} {
      height: auto;
      svg {
        fill: ${isOnBookingWidget ? theme.colors.primary : whiteColor};
      }
    }

    ${DropdownContainer} {
      top: 18px;
      right: 0;
      left: unset;
      border-color: ${theme.colors.primary};
    }
  `
);

const StyledFlightFareCategoryContainer = styled(FlightFareCategoryContainer)<{
  isOnBookingWidget: boolean;
}>(
  ({ theme, isOnBookingWidget }) => css`
    ${Wrapper} {
      margin-top: 0;
    }
    ${ContentDropdownStyled} {
      margin-top: 0;
    }
    ${NoBackgroundDisplay} {
      color: ${isOnBookingWidget ? theme.colors.primary : whiteColor};
    }
    ${DropdownContainer} {
      top: 20px;
      right: 0;
      left: unset;
      border-color: ${theme.colors.primary};
    }
    ${DisplayValue} {
      svg {
        fill: ${isOnBookingWidget ? theme.colors.primary : whiteColor};
      }
    }
  `
);

const StyledBookingWidgetExtra = styled(BookingWidgetExtra)`
  ${DisplayWrapper} {
    margin-left: ${gutters.small / 2}px;
  }
`;

const LoadingBagsSkeleton = styled.span<{ isOnBookingWidget: boolean }>(({ isOnBookingWidget }) => [
  isOnBookingWidget ? skeletonPulse : skeletonPulseBlue,
  css`
    display: inline-block;
    margin: ${gutters.small / 4}px 0;
    border-radius: 2px;
    width: 46px;
    height: 12px;
  `,
]);

const StyledBookingWidgetExtrasRow = styled(BookingWidgetExtrasRow)`
  & + ${StyledBookingWidgetSectionHeading} {
    margin-top: ${gutters.small}px;
  }
`;

const VPBookingWidgetFlightExtras = ({
  isOnBookingWidget = false,
  className,
  vacationIncludesFlight,
}: {
  isOnBookingWidget?: boolean;
  className?: string;
  vacationIncludesFlight?: boolean;
}) => {
  const { onVPFlightTypeChange, onVPCabinTypeChange } = useContext(VPActionCallbackContext);
  const { selectedFlight, cabinType, flightType, isBaggageLoading } =
    useContext(VPFlightStateContext);
  const [, toggleFlightExtrasEditModal] = useOnToggleModal(
    VPActiveModalTypes.EditFlight,
    selectedFlight?.id
  );
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const bagOptions = useMemo(
    () => [
      {
        id: "bags",
        name: vacationPackageT("Bags"),
      },
    ],
    [vacationPackageT]
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const doNothing = useCallback(() => {}, []);
  return (
    <StyledBookingWidgetExtrasRow className={className}>
      <StyledFlightTypeContainer
        id="extra-flight-return"
        flightType={flightType}
        onFlightTypeChange={onVPFlightTypeChange}
        directionOverflow="right"
        isOnBookingWidget={isOnBookingWidget}
      />
      <StyledFlightFareCategoryContainer
        id="extra-cabin-type"
        cabinType={cabinType}
        onCabinTypeChange={onVPCabinTypeChange}
        noBackground
        autoHeight
        isOnBookingWidget={isOnBookingWidget}
      />
      {vacationIncludesFlight && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {isBaggageLoading ? (
            <LoadingBagsSkeleton isOnBookingWidget={isOnBookingWidget} />
          ) : (
            <StyledBookingWidgetExtra
              id="extra-cabin-bags"
              selectedOptionId={bagOptions[0].id}
              options={bagOptions}
              onChange={doNothing}
              onClick={toggleFlightExtrasEditModal}
            />
          )}
        </>
      )}
    </StyledBookingWidgetExtrasRow>
  );
};

export default VPBookingWidgetFlightExtras;
