import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useHideMobileKeyboard } from "components/ui/Inputs/AutocompleteInput/utils/autocompleteUtils";
import { AutocompleteInputLarge } from "components/ui/FrontSearchWidget/FrontTabsShared";
import SearchIcon from "components/icons/search.svg";

const InputWrapper = styled.div`
  position: relative;
`;

const SingleLocationPicker = ({
  id,
  isMobile,
  onOriginLocationChange,
  onLocationClick,
  defaultOrigin,
  origin,
  originPlaceholder,
  Icon = SearchIcon,
  originLocations,
  onOriginInputChange,
  className,
}: {
  id: string;
  isMobile: boolean;
  onOriginLocationChange: (originId?: string, originName?: string) => void;

  onLocationClick?: () => void;
  defaultOrigin?: string;
  origin?: string;
  originPlaceholder?: string;
  Icon?: React.ElementType;
  originLocations?: SharedTypes.AutocompleteItem[];
  onOriginInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  const hideMobileKeyboard = useHideMobileKeyboard();

  const onOriginClick = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) {
        onOriginLocationChange(item.id, item.name);
      }
    },
    [onOriginLocationChange]
  );

  return (
    <InputWrapper className={className}>
      <AutocompleteInputLarge
        id={`${id}Origin`}
        listItems={originLocations}
        placeholder={originPlaceholder}
        onInputChange={onOriginInputChange}
        onItemClick={onOriginClick}
        onInputClick={onLocationClick}
        ListIcon={Icon}
        disabled={isMobile}
        hideMobileKeyboard={hideMobileKeyboard}
        halfWidth
        defaultValue={origin !== defaultOrigin ? origin : defaultOrigin}
        className={className}
      />
    </InputWrapper>
  );
};

export default SingleLocationPicker;
