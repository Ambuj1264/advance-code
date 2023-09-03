import React from "react";

import { CarSearchWidgetSharedTypes } from "../contexts/CarSearchWidgetCallbackContext";

import DoublePickupLocationContainer from "./DoublePickupLocationContainer";

const CarnectLocationPickerContainer = ({
  selectedPickupId,
  selectedDropoffId,
  onPickupChange,
  onDropoffChange,
  onPickupInputClick,
  onDropoffInputClick,
  onClearCarLocation,
  disabled = false,
  selectedPickupName,
  selectedDropoffName,
  shouldInitializeInputs = true,
  isWideDropdown,
  countryCode,
  className,
}: {
  selectedPickupId?: string;
  selectedDropoffId?: string;
  selectedPickupName?: string;
  selectedDropoffName?: string;
  onPickupChange: CarSearchWidgetSharedTypes["onLocationChange"];
  onDropoffChange?: CarSearchWidgetSharedTypes["onLocationChange"];
  onPickupInputClick?: () => void;
  onDropoffInputClick?: () => void;
  onClearCarLocation?: (pickupDropoff?: "pickup" | "dropoff") => void;
  disabled?: boolean;
  shouldInitializeInputs?: boolean;
  isWideDropdown?: boolean;
  countryCode?: string;
  className?: string;
}) => {
  return (
    <DoublePickupLocationContainer
      className={className}
      disabled={disabled}
      onPickupItemSelect={onPickupChange}
      onDropoffItemSelect={onDropoffChange}
      onPickupInputClick={onPickupInputClick}
      onDropoffInputClick={onDropoffInputClick}
      onClearCarLocation={onClearCarLocation}
      pickupLocationId={selectedPickupId}
      dropoffLocationId={selectedDropoffId}
      selectedDropoffName={selectedDropoffName}
      selectedPickupName={selectedPickupName}
      shouldInitializeInputs={shouldInitializeInputs}
      isWideDropdown={isWideDropdown}
      countryCode={countryCode}
    />
  );
};

export default CarnectLocationPickerContainer;
