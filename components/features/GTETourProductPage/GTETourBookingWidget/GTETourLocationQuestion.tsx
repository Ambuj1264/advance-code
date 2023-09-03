import React, { useCallback, ChangeEvent, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useQuery } from "@apollo/react-hooks";

import TourPickupPlacesQuery from "./queries/TourPickupPlacesQuery.graphql";

import AutocompleteInput, {
  InputStyled,
  ContentDropdownStyled,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { mqMin } from "styles/base";
import { redColor } from "styles/variables";

const StyledAutocompleteInput = styled(AutocompleteInput)<{
  hasError: boolean;
}>(
  ({ theme, hasError }) => css`
    ${InputStyled} {
      border: 1px solid ${hasError ? redColor : theme.colors.primary};
      height: 45px;
    }
    ${ContentDropdownStyled} {
      ${DropdownContainer} {
        ${mqMin.large} {
          width: auto;
          max-width: 100%;
        }
      }
    }
  `
);

const GTETourLocationQuestion = ({
  id,
  answer,
  onChange,
  onBlur,
  productCode,
  hasError = false,
  locationType,
}: {
  id: string;
  answer: SharedTypes.AutocompleteItem;
  onChange: (value: SharedTypes.AutocompleteItem) => void;
  onBlur?: () => void;
  productCode: string;
  hasError?: boolean;
  locationType?: string;
}) => {
  const [listItems, setListItems] = useState<SharedTypes.AutocompleteItem[]>([]);
  useQuery<{
    filterPickupPlaces: SharedTypes.AutocompleteItem[];
  }>(TourPickupPlacesQuery, {
    variables: {
      productCode,
      query: answer.name || "",
      type: locationType,
    },
    onCompleted: ({ filterPickupPlaces }) => {
      setListItems(filterPickupPlaces);
    },
  });
  const handleInputChange = useCallback(
    (event?: ChangeEvent<HTMLInputElement>) => {
      const inputValue = String(event?.target?.value ?? "");
      onChange({
        id: "",
        name: inputValue,
      });
    },
    [onChange]
  );
  return (
    <StyledAutocompleteInput
      id={`${id}Location`}
      listItems={listItems}
      placeholder={answer.name}
      onInputChange={handleInputChange}
      onItemClick={(value?: SharedTypes.AutocompleteItem) => onChange(value || answer)}
      defaultValue={answer.name}
      isWideDropdown={false}
      selectFirstOnBlur={false}
      onBlur={onBlur}
      hasError={hasError}
      skipIcon
    />
  );
};

export default GTETourLocationQuestion;
