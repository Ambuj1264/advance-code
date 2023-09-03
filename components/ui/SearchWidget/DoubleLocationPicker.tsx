import React, { useCallback } from "react";

import { useHideMobileKeyboard } from "components/ui/Inputs/AutocompleteInput/utils/autocompleteUtils";
import { AutocompleteInputLargeHalf } from "components/ui/FrontSearchWidget/FrontTabsShared";
import SearchIcon from "components/icons/search.svg";
import { AutocompleteDoubleWrapper } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { AutoCompleteType } from "types/enums";

const DoubleLocationPicker = ({
  id,
  isMobile,
  onOriginLocationChange,
  onDestinationLocationChange,
  onOriginLocationClick,
  onDestinationLocationClick,
  defaultOrigin,
  defaultDestination,
  origin,
  destination,
  originPlaceholder,
  destinationPlaceholder,
  Icon = SearchIcon,
  originLocations,
  destinationLocations,
  onOriginInputChange,
  onDestinationInputChange,
  disableDestinationInput = false,
  className,
  isOpen = false,
  firstAutocompleteInputType,
  secondAutocompleteInputType,
  originInputRef,
}: {
  id: string;
  isMobile: boolean;
  onOriginLocationChange: (originId?: string, originName?: string, countryCode?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  origin?: string;
  destination?: string;
  originPlaceholder?: string;
  destinationPlaceholder?: string;
  Icon?: React.ElementType;
  originLocations?: SharedTypes.AutocompleteItem[];
  destinationLocations?: SharedTypes.AutocompleteItem[];
  onOriginInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDestinationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disableDestinationInput?: boolean;
  className?: string;
  isOpen?: boolean;
  firstAutocompleteInputType?: AutoCompleteType;
  secondAutocompleteInputType?: AutoCompleteType;
  originInputRef?: React.MutableRefObject<VacationPackageTypes.originInputRef>;
}) => {
  const hideMobileKeyboard = useHideMobileKeyboard();

  const onOriginClick = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) {
        onOriginLocationChange(item.id, item.name, item.countryCode);
      }
    },
    [onOriginLocationChange]
  );

  const onDestinationClick = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) {
        onDestinationLocationChange(item.id, item.name);
      }
    },
    [onDestinationLocationChange]
  );

  return (
    <AutocompleteDoubleWrapper
      styledAutocompleteComponent={AutocompleteInputLargeHalf}
      className={className}
    >
      <AutocompleteInputLargeHalf
        id={`${id}Origin`}
        listItems={originLocations}
        placeholder={originPlaceholder}
        onInputChange={onOriginInputChange}
        onItemClick={onOriginClick}
        onInputClick={onOriginLocationClick}
        ListIcon={Icon}
        disabled={isMobile}
        hideMobileKeyboard={hideMobileKeyboard}
        halfWidth
        defaultValue={origin !== defaultOrigin ? origin : defaultOrigin}
        isOpen={isOpen}
        defaultAutocompleteIconType={firstAutocompleteInputType}
        originInputRef={originInputRef}
        className={className}
      />
      <AutocompleteInputLargeHalf
        id={`${id}Destination`}
        listItems={destinationLocations}
        placeholder={destinationPlaceholder}
        onInputChange={onDestinationInputChange}
        onItemClick={onDestinationClick}
        onInputClick={onDestinationLocationClick}
        ListIcon={Icon}
        readOnly={disableDestinationInput}
        disabled={isMobile || disableDestinationInput}
        hideMobileKeyboard={hideMobileKeyboard}
        halfWidth
        defaultValue={destination !== defaultDestination ? destination : defaultDestination}
        defaultAutocompleteIconType={secondAutocompleteInputType}
        className={className}
      />
    </AutocompleteDoubleWrapper>
  );
};

export default DoubleLocationPicker;
