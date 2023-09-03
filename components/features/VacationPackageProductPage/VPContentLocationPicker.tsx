import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React, { useCallback, useContext } from "react";

import FlightConstantContext from "../Flight/contexts/FlightConstantContext";
import VacationLocationPicker from "../VacationPackagesSearchWidget/VacationLocationPicker";

import { VPFlightStateContext } from "./contexts/VPFlightStateContext";
import { VPStepsTypes, VPModalCallbackContext } from "./contexts/VPModalStateContext";
import VPBookingWidgetFlightExtras from "./VPBookingWidget/VPBookingWidgetFlightExtras";
import VPMobileFlightTypePicker from "./VPMobileFlightTypePicker";
import { VPActionCallbackContext } from "./contexts/VPActionStateContext";

import { StyledRadioSelectionDropdown } from "components/ui/BookingWidget/BookingWidgetExtras";
import { ClearWrapper } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { DisplayWrapper } from "components/ui/Inputs/RadioSelectionDropdown";
import Label, { LabelParagraph } from "components/ui/SearchWidget/Label";
import { DesktopColumn } from "components/ui/SearchWidget/SearchWidgetShared";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMax, mqMin } from "styles/base";
import {
  fontSizeBody2,
  fontWeightSemibold,
  greyColor,
  guttersPx,
  whiteColor,
} from "styles/variables";

export const StyledVacationLocationPicker = styled(VacationLocationPicker)(
  ({ theme }) => css`
    ${LabelParagraph} {
      color: ${greyColor};
      font-weight: ${fontWeightSemibold};
    }
    svg {
      fill: ${theme.colors.primary};
    }

    ${ClearWrapper} {
      svg {
        fill: ${greyColor};
      }
    }
  `
);

export const StyledVPBookingWidgetFlightExtras = styled(VPBookingWidgetFlightExtras)<{
  id: string;
}>`
  align-items: center;
  justify-content: flex-start;
  margin-top: 0;
  padding: 0;

  ${mqMin.large} {
    width: 150%;
    height: 32px;
  }
  ${mqMax.large} {
    display: none;
  }
  ${DropdownContainer} {
    left: -${guttersPx.large};
  }
  ${StyledRadioSelectionDropdown} {
    color: ${whiteColor};
    ${DisplayWrapper} {
      ${mqMin.large} {
        color: ${whiteColor};
      }
    }
  }
  ${DisplayValue} {
    svg {
      ${mqMin.large} {
        fill: ${whiteColor};
      }
    }
    ${mqMin.large} {
      color: ${whiteColor};
    }
  }
`;

export const StyledVPMobileFlightTypePicker = styled(VPMobileFlightTypePicker)`
  ${mqMin.large} {
    display: none;
  }
  ${mqMax.large} {
    height: 32px;
  }
`;

export const StyledLabel = styled(Label)(
  css`
    color: ${whiteColor};
    font-size: ${fontSizeBody2};
    line-height: 32px;
    ${mqMax.large} {
      color: ${greyColor};
    }
  `
);

const VPContentLocationPicker = ({
  label,
  className,
  vacationIncludesFlight,
  originInputRef,
}: {
  label?: string;
  className?: string;
  vacationIncludesFlight: boolean;
  originInputRef?: React.MutableRefObject<VacationPackageTypes.originInputRef>;
}) => {
  const { origin, originId } = useContext(VPFlightStateContext);
  const { destination } = useContext(FlightConstantContext);
  const isMobile = useIsMobile();
  const { onVPOriginLocationChange } = useContext(VPActionCallbackContext);
  const { onToggleIsOpen } = useContext(VPModalCallbackContext);

  const changeToggleIsOpen = useCallback(
    (stepType: VPStepsTypes) => {
      return isMobile ? () => onToggleIsOpen(stepType) : undefined;
    },
    [isMobile, onToggleIsOpen]
  );

  return (
    <DesktopColumn baseWidth={40} className={className}>
      {label && (
        <StyledLabel>
          <Trans ns={Namespaces.vacationPackageNs}>{label}</Trans>
        </StyledLabel>
      )}
      <StyledVacationLocationPicker
        isMobile={isMobile}
        onOriginLocationClick={changeToggleIsOpen(VPStepsTypes.Location)}
        onDestinationLocationClick={changeToggleIsOpen(VPStepsTypes.Location)}
        onOriginLocationChange={onVPOriginLocationChange}
        onDestinationLocationChange={() => {}}
        origin={origin}
        defaultOriginId={originId}
        defaultDestination={destination}
        defaultDestinationId="europe"
        vacationIncludesFlight
        hideLabels
        isOnProductPage
        originInputRef={originInputRef}
      />
      <StyledVPBookingWidgetFlightExtras
        id="vpContentFlightExtras"
        vacationIncludesFlight={vacationIncludesFlight}
      />
      <StyledVPMobileFlightTypePicker />
    </DesktopColumn>
  );
};

export default VPContentLocationPicker;
