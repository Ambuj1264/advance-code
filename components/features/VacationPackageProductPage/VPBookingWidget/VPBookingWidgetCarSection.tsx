import React, { useCallback, useEffect, useState, useContext } from "react";
import styled from "@emotion/styled";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { VPCarStateContext } from "../contexts/VPCarStateContext";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPBookingWidgetCarDropdownContent from "./VPBookingWidgetCarDropdownContent";
import VPBookingWidgetCarExtras from "./VPBookingWidgetCarExtras";

import CarIcon from "components/icons/car.svg";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import BookingWidgetDropdown from "components/ui/BookingWidget/BookingWidgetDropdown";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";

const StyledVPBookingWidgetCarDropdown = styled(BookingWidgetDropdown)(
  ({ theme }) => `
    ${DropdownContainer} {
      top: 50px;
      border-color: ${theme.colors.primary};
    }
`
);

const VPBookingWidgetCarSection = ({
  onOpenStateChange,
  activeDropdown,
}: {
  activeDropdown?: VPSearchWidgetTypes.activeDropdownType;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { vacationIncludesCar, carResults, carOffersError, carOffersLoading, selectedCarId } =
    useContext(VPCarStateContext);
  const [shouldOpenOnLoad, setShouldOpenOnLoad] = useState(false);
  const [, onCarInfoClick] = useOnToggleModal(VPActiveModalTypes.InfoCar, selectedCarId);
  const { onIncludeVPCarsToggle, onSelectVPCarOffer } = useContext(VPActionCallbackContext);
  const isCarSelectionDisabled = Boolean(carOffersLoading || carOffersError || !selectedCarId);
  const nonIncludedCarDropdownClick = useCallback(() => {
    onIncludeVPCarsToggle(true);
    setShouldOpenOnLoad(true);
  }, [onIncludeVPCarsToggle]);

  useEffect(() => {
    if (shouldOpenOnLoad && !isCarSelectionDisabled) {
      onOpenStateChange?.(true);
      setShouldOpenOnLoad(false);
    }
  }, [isCarSelectionDisabled, onOpenStateChange, shouldOpenOnLoad]);

  const selectedCarTitle = carResults.find(car => String(car.id) === selectedCarId)?.headline || "";
  const subTypeString: { [carSubType: string]: string } = {
    Small: "Small included",
    Medium: "Medium included",
    Premium: "Premium included",
  };
  const selectedCarSubtype =
    carResults.find(car => String(car.id) === selectedCarId)?.subtype || "";
  const isOpen = activeDropdown === "car";

  return (
    <>
      <BookingWidgetControlRow
        title={vacationPackageT("Car")}
        subtitle={
          !isCarSelectionDisabled ? vacationPackageT(subTypeString[selectedCarSubtype]) : undefined
        }
        onInfoClick={selectedCarId ? onCarInfoClick : undefined}
        isOpen={isOpen}
        onToggleChange={onIncludeVPCarsToggle}
        isChecked={vacationIncludesCar}
        alwaysUseThemeToggleColor
      >
        <StyledVPBookingWidgetCarDropdown
          id="carDropdown"
          onClick={vacationIncludesCar ? undefined : nonIncludedCarDropdownClick}
          isOpen={isOpen}
          isSelected={Boolean(selectedCarId) || carOffersLoading}
          isDisabled={isCarSelectionDisabled}
          selectedTitle={selectedCarTitle}
          isLoading={carOffersLoading}
          onOpenStateChange={onOpenStateChange}
          Icon={CarIcon}
          matchesDefaultSelectedItem
        >
          <VPBookingWidgetCarDropdownContent
            selectedCarId={selectedCarId!}
            sortedCars={carResults}
            onSelectCarOffer={onSelectVPCarOffer}
          />
        </StyledVPBookingWidgetCarDropdown>
      </BookingWidgetControlRow>
      <VPBookingWidgetCarExtras />
    </>
  );
};

export default VPBookingWidgetCarSection;
