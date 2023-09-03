import React, { ChangeEvent } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { AutocompleteInputModalStyled } from "./AutocompleteModalHelpers";

import SearchIcon from "components/icons/search.svg";
import { AutoCompleteType } from "types/enums";
import { typographyCaptionSemibold } from "styles/typography";
import { blackColor, gutters } from "styles/variables";

const Wrapper = styled.div``;

export const BookingWidgetLabel = styled.div([
  typographyCaptionSemibold,
  css`
    margin: ${gutters.small}px 0 ${gutters.small / 2}px 0;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const MobileStepLocation = ({
  onInputChange,
  onItemClick,
  startingLocationItems,
  locationPlaceholder,
  defaultValue,
  isOpen = false,
  disableDestinationInput = false,
  inputAutocompleteIconType,
  defaultAutocompleteIconType,
  forceFocus,
  label,
}: {
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onItemClick: (item?: SharedTypes.AutocompleteItem) => void;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  locationPlaceholder?: string;
  defaultValue?: string;
  isOpen?: boolean;
  disableDestinationInput?: boolean;
  inputAutocompleteIconType?: AutoCompleteType;
  defaultAutocompleteIconType?: AutoCompleteType;
  forceFocus?: boolean;
  label?: string;
}) => {
  return (
    <Wrapper>
      {label && <BookingWidgetLabel>{label}</BookingWidgetLabel>}
      <AutocompleteInputModalStyled
        id="autocomplete"
        listItems={startingLocationItems}
        placeholder={locationPlaceholder}
        defaultValue={locationPlaceholder !== defaultValue ? defaultValue : undefined}
        onInputChange={onInputChange}
        onItemClick={onItemClick}
        ListIcon={SearchIcon}
        fullWidth
        disabled={disableDestinationInput}
        hideMobileKeyboard={disableDestinationInput}
        defaultAutocompleteIconType={defaultAutocompleteIconType}
        inputAutocompleteIconType={inputAutocompleteIconType}
        forceFocus={forceFocus}
        isOpen={isOpen}
      />
    </Wrapper>
  );
};

export default MobileStepLocation;
