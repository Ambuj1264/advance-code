import React, { useCallback, useState, useEffect, useMemo } from "react";

import useCarPickupLocationQuery from "../useCarPickupLocationQuery";
import { getCarAutocompleteOptions, getPlaceTypeByPlaceId } from "../utils/carSearchWidgetUtils";
import { useHideMobileKeyboard } from "../../Inputs/AutocompleteInput/utils/autocompleteUtils";

import { AutocompleteInputLargeHalf } from "components/ui/FrontSearchWidget/FrontTabsShared";
import { AutocompleteDoubleWrapper } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { CarSearchWidgetSharedTypes } from "components/ui/CarSearchWidget/contexts/CarSearchWidgetCallbackContext";
import SearchIcon from "components/icons/search.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const DoublePickupLocationContainer = ({
  disabled,
  onPickupItemSelect,
  onDropoffItemSelect,
  onPickupInputClick,
  onDropoffInputClick,
  onClearCarLocation,
  pickupLocationId,
  dropoffLocationId,
  selectedPickupName,
  selectedDropoffName,
  shouldInitializeInputs,
  isWideDropdown,
  countryCode,
  className,
}: {
  disabled: boolean;
  onPickupItemSelect: CarSearchWidgetSharedTypes["onLocationChange"];
  onDropoffItemSelect?: CarSearchWidgetSharedTypes["onLocationChange"];
  onPickupInputClick?: () => void;
  onDropoffInputClick?: () => void;
  onClearCarLocation?: (pickupDropoff?: "pickup" | "dropoff") => void;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  selectedPickupName?: string;
  selectedDropoffName?: string;
  shouldInitializeInputs: boolean;
  isWideDropdown?: boolean;
  countryCode?: string;
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);

  const fromPlaceholder = t("Pick up location");
  const toPlaceholder = t("Drop off location");
  const [pickupInput, setPickupInput] = useState<string | undefined>();
  const [dropOffInput, setDropOffInput] = useState<string | undefined>();
  const [locationsInputsPristineState, setLocationInputsPristineState] = useState({
    pickupInputIsPristine: true,
    dropOffInputIsPristine: true,
  });
  const isEurope = countryCode === "EU";
  const { data: pickupData } = useCarPickupLocationQuery({
    searchQuery: pickupInput,
    type: "From",
    countryCode: !pickupInput && !isEurope ? countryCode : undefined,
  });
  const { data: dropOffData } = useCarPickupLocationQuery({
    searchQuery: dropOffInput,
    type: "To",
    countryCode: !dropOffInput && !isEurope ? countryCode : undefined,
  });

  const pickupLocationItems = useMemo(() => {
    return pickupData ? getCarAutocompleteOptions(pickupData.availableLocations.locations) : [];
  }, [pickupData]);

  const dropOffLocationItems = useMemo(() => {
    return dropOffData ? getCarAutocompleteOptions(dropOffData.availableLocations.locations) : [];
  }, [dropOffData]);

  useEffect(() => {
    const { pickupInputIsPristine, dropOffInputIsPristine } = locationsInputsPristineState;
    if (!pickupLocationItems.length || !shouldInitializeInputs) return;

    if (pickupInputIsPristine && !pickupLocationId) {
      onPickupItemSelect(pickupLocationItems[0]);
    }

    if (dropOffInputIsPristine && !dropoffLocationId) {
      onDropoffItemSelect?.(dropOffLocationItems[0]);
    }
  }, [
    dropoffLocationId,
    dropOffLocationItems,
    locationsInputsPristineState,
    onDropoffItemSelect,
    onPickupItemSelect,
    pickupLocationId,
    pickupLocationItems,
    shouldInitializeInputs,
  ]);

  const hideMobileKeyboard = useHideMobileKeyboard();
  const onPickUpInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPickupInput(e.target.value);
      if (e.target.value === "" && onClearCarLocation) {
        onClearCarLocation("pickup");
        setLocationInputsPristineState(prevState => ({
          ...prevState,
          pickupInputIsPristine: false,
        }));
      }
    },
    [onClearCarLocation]
  );
  const onDropOffInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDropOffInput(e.target.value);
      if (e.target.value === "" && onClearCarLocation) {
        onClearCarLocation("dropoff");
        setLocationInputsPristineState(prevState => ({
          ...prevState,
          dropOffInputIsPristine: false,
        }));
      }
    },
    [onClearCarLocation]
  );
  const defaultPickupValue = pickupLocationId ? selectedPickupName : undefined;
  const defaultDropoffValue = dropoffLocationId ? selectedDropoffName : undefined;

  return (
    <AutocompleteDoubleWrapper
      styledAutocompleteComponent={AutocompleteInputLargeHalf}
      className={className}
    >
      <AutocompleteInputLargeHalf
        id="cars-pickup-location-id"
        listItems={pickupLocationItems}
        defaultValue={defaultPickupValue}
        onInputChange={onPickUpInputChange}
        onItemClick={onPickupItemSelect}
        onInputClick={onPickupInputClick}
        ListIcon={SearchIcon}
        disabled={disabled}
        hideMobileKeyboard={hideMobileKeyboard}
        placeholder={fromPlaceholder}
        isWideDropdown={isWideDropdown}
        halfWidth
        inputAutocompleteIconType={getPlaceTypeByPlaceId(pickupLocationId)}
      />
      <AutocompleteInputLargeHalf
        id="cars-dropoff-location-id"
        listItems={dropOffLocationItems}
        defaultValue={defaultDropoffValue}
        onInputChange={onDropOffInputChange}
        onItemClick={onDropoffItemSelect}
        onInputClick={onDropoffInputClick}
        ListIcon={SearchIcon}
        disabled={disabled}
        hideMobileKeyboard={hideMobileKeyboard}
        placeholder={toPlaceholder}
        isWideDropdown={isWideDropdown}
        halfWidth
        inputAutocompleteIconType={getPlaceTypeByPlaceId(dropoffLocationId)}
      />
    </AutocompleteDoubleWrapper>
  );
};

export default DoublePickupLocationContainer;
