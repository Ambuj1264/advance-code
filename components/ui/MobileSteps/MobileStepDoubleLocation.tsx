import React from "react";

import { AutocompleteDoubleInputModalStyled, DoubleLabel } from "./AutocompleteModalHelpers";

import SearchIcon from "components/icons/search.svg";
import { AutoCompleteType } from "types/enums";
import { AutocompleteDoubleWrapper } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";

const MobileStepDoubleLocation = ({
  originId,
  destinationId,
  onOriginLocationChange,
  onDestinationLocationChange,
  onOriginItemClick,
  onDestinationItemClick,
  defaultOrigin,
  defaultDestination,
  origin,
  destination,
  disableDestinationInput = false,
  originLabel,
  destinationLabel,
  originLocations,
  destinationLocations,
  originPlaceholder,
  destinationPlaceholder,
  defaultOriginAutocompleteIconType,
  defaultDestinationAutocompleteIconType,
  originInput,
  destinationInput,
  forceFocusOrigin = false,
  forceFocusDestination = false,
}: {
  originId: string;
  destinationId: string;
  onOriginLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDestinationLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOriginItemClick?: (item?: SharedTypes.AutocompleteItem) => void;
  onDestinationItemClick?: (item?: SharedTypes.AutocompleteItem) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  origin?: string;
  destination?: string;
  disableDestinationInput?: boolean;
  originLabel?: string;
  destinationLabel?: string;
  originLocations?: SharedTypes.AutocompleteItem[];
  destinationLocations?: SharedTypes.AutocompleteItem[];
  originPlaceholder?: string;
  destinationPlaceholder?: string;
  defaultOriginAutocompleteIconType?: AutoCompleteType;
  defaultDestinationAutocompleteIconType?: AutoCompleteType;
  originInput: string;
  destinationInput: string;
  forceFocusOrigin?: boolean;
  forceFocusDestination?: boolean;
}) => {
  const isDefaultOrigin = defaultOrigin === origin;
  const isDefaultDestination = defaultDestination === destination;
  return (
    <>
      <DoubleLabel leftLabel={originLabel} rightLabel={destinationLabel} />
      <AutocompleteDoubleWrapper styledAutocompleteComponent={AutocompleteDoubleInputModalStyled}>
        <AutocompleteDoubleInputModalStyled
          id={originId}
          listItems={originLocations}
          placeholder={originPlaceholder}
          defaultValue={!isDefaultOrigin ? origin : originInput}
          onInputChange={onOriginLocationChange}
          onItemClick={onOriginItemClick}
          ListIcon={SearchIcon}
          fullWidth
          defaultAutocompleteIconType={defaultOriginAutocompleteIconType}
          forceFocus={forceFocusOrigin}
        />
        <AutocompleteDoubleInputModalStyled
          id={destinationId}
          listItems={destinationLocations}
          placeholder={destinationPlaceholder}
          defaultValue={!isDefaultDestination ? destination : destinationInput}
          onItemClick={onDestinationItemClick}
          onInputChange={onDestinationLocationChange}
          ListIcon={SearchIcon}
          fullWidth
          disabled={disableDestinationInput}
          hideMobileKeyboard={disableDestinationInput}
          defaultAutocompleteIconType={defaultDestinationAutocompleteIconType}
          forceFocus={forceFocusDestination}
        />
      </AutocompleteDoubleWrapper>
    </>
  );
};

export default MobileStepDoubleLocation;
