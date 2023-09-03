import React, { useState } from "react";
import styled from "@emotion/styled";

import { CarSearchWidgetSharedTypes } from "../contexts/CarSearchWidgetCallbackContext";
import useCarPickupLocationQuery from "../useCarPickupLocationQuery";
import { getCarAutocompleteOptions, getPlaceTypeByPlaceId } from "../utils/carSearchWidgetUtils";

import { Namespaces } from "shared/namespaces";
import { typographyBody2 } from "styles/typography";
import {
  AutocompleteInputModalStyled,
  ListItemModal,
} from "components/ui/MobileSteps/AutocompleteModalHelpers";
import LocationIcon from "components/icons/gps.svg";
import SearchIcon from "components/icons/search.svg";
import { gutters } from "styles/variables";
import AutocompleteInput from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { DropdownContentWrapper } from "components/ui/Inputs/ContentDropdown";
import { useTranslation } from "i18n";

const Wrapper = styled.div``;

const AutocompleteMobileStyled = styled(AutocompleteInputModalStyled)`
  margin: 0 -${gutters.small}px;

  input {
    ${typographyBody2}
  }

  ${DropdownContentWrapper} {
    height: 100vh;
  }
`;

const LocationPickerContainer = ({
  id,
  className,
  onChange,
  onInputClick,
  disabled = false,
  isMobile = false,
  isOpen,
  type,
  selectedName,
  selectedPlaceId,
}: {
  id: string;
  className?: string;
  onChange: CarSearchWidgetSharedTypes["onLocationChange"];
  onInputClick?: () => void;
  disabled?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  selectedName?: string;
  selectedPlaceId?: string;
  type: "From" | "To";
}) => {
  const [inputString, setInputString] = useState("");
  const { data } = useCarPickupLocationQuery({
    searchQuery: inputString,
    type,
  });
  const { t } = useTranslation(Namespaces.commonSearchNs);

  const autoCompleteOptions = data
    ? getCarAutocompleteOptions(data.availableLocations.locations)
    : undefined;

  const sharedAutocompleteProps = {
    id,
    placeholder: selectedName || t("City, Airport, station, region, district"),
    defaultValue: "",
    InputIcon: LocationIcon,
    ListIcon: SearchIcon,
    listItems: autoCompleteOptions,
    onItemClick: onChange,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputString(e.target.value);
    },
    onInputClick,
    disabled,
    inputAutocompleteIconType: selectedName
      ? getPlaceTypeByPlaceId(selectedPlaceId)
      : getPlaceTypeByPlaceId(),
  };

  return (
    <Wrapper className={className}>
      {isMobile ? (
        <AutocompleteMobileStyled
          {...sharedAutocompleteProps}
          ListItemComponent={ListItemModal}
          isOpen={isOpen}
          fullWidth
        />
      ) : (
        <AutocompleteInput {...sharedAutocompleteProps} />
      )}
    </Wrapper>
  );
};

export default LocationPickerContainer;
