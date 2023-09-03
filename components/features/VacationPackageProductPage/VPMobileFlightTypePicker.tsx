import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { VPFlightStateContext } from "./contexts/VPFlightStateContext";
import { VPActionCallbackContext } from "./contexts/VPActionStateContext";

import FlightTypeContainer from "components/ui/FlightSearchWidget/FlightTypeContainer";
import FlightFareCategoryContainer, {
  ContentDropdownStyled,
  NoBackgroundDisplay,
} from "components/ui/FlightSearchWidget/FlightFareCategoryContainer";
import { DisplayWrapper } from "components/ui/Inputs/RadioSelectionDropdown";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { gutters } from "styles/variables";

const FlightTypeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledFlightTypeContainer = styled(FlightTypeContainer)(
  ({ theme }) => css`
    margin-right: ${gutters.small}px;
    ${DisplayWrapper} {
      color: ${theme.colors.primary};
    }
    ${DisplayValue} {
      height: auto;
      svg {
        fill: ${theme.colors.primary};
      }
    }
  `
);

const StyledFlightFareCategoryContainer = styled(FlightFareCategoryContainer)(
  ({ theme }) => css`
    padding-right: 0;
    ${NoBackgroundDisplay} {
      margin-left: 0;
      color: ${theme.colors.primary};
    }
    ${DisplayValue} {
      svg {
        fill: ${theme.colors.primary};
      }
    }
    ${DropdownContainer} {
      left: auto;
    }
    ${ContentDropdownStyled} {
      padding-right: 0;
    }
  `
);

const VPMobileFlightTypePicker = ({ className }: { className?: string }) => {
  const { cabinType, flightType } = useContext(VPFlightStateContext);
  const { onVPFlightTypeChange, onVPCabinTypeChange } = useContext(VPActionCallbackContext);
  return (
    <FlightTypeWrapper className={className}>
      <StyledFlightTypeContainer
        id="extra-flight-return"
        flightType={flightType}
        onFlightTypeChange={onVPFlightTypeChange}
        directionOverflow="right"
      />
      <StyledFlightFareCategoryContainer
        id="extra-cabin-type"
        cabinType={cabinType}
        onCabinTypeChange={onVPCabinTypeChange}
        noBackground
        autoHeight
      />
    </FlightTypeWrapper>
  );
};

export default VPMobileFlightTypePicker;
