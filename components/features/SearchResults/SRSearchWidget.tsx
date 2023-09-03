import React, { useCallback, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useQueryParams } from "use-query-params";

import {
  InputSearch,
  InputWrapper,
  StyledSearchIcon,
} from "../Header/Header/NavigationBar/GTESearch/SearchInputAndDropdown";

import {
  SearchResultPageQueryParamScheme,
  SearchEnums,
} from "./types/SearchResultsQueryParamTypes";

import FilterHeading from "components/ui/Filters/FilterHeading";
import SearchIcon from "components/icons/search.svg";
import { mqMin } from "styles/base";
import { lightBlueColor, gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";

const SearchInputContainer = styled.div`
  margin-top: 20px;
`;

const InputContainer = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const StyledInputSearch = styled(InputSearch)`
  ${mqMin.large} {
    border: 2px solid ${lightBlueColor};
    width: 100%;
    height: 40px;
    padding-right: ${gutters.small / 2}px;
    background-color: transparent;
  }
`;

const SRSearchWidget = ({ searchParam = "" }: { searchParam?: string }) => {
  const [searchInput, setSearchInput] = useState(searchParam);
  const [, setPageQueryParams] = useQueryParams(SearchResultPageQueryParamScheme);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.currentTarget.value);
    },
    [setSearchInput]
  );

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && searchInput.length > 2) {
      setPageQueryParams(
        {
          [SearchEnums.NEXT_PAGE_ID]: "1",
          [SearchEnums.SEARCH]: searchInput,
        },
        QueryParamTypes.PUSH_IN
      );
    }
  };
  const { t } = useTranslation(Namespaces.commonNs);

  return (
    <SearchInputContainer>
      <FilterHeading
        title={t("Search")}
        Icon={SearchIcon}
        numberOfSelectedFilters={0}
        onClearFilterClick={() => {}}
      />
      <InputContainer>
        <InputWrapper>
          <StyledSearchIcon />
          <StyledInputSearch
            value={searchInput}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
      </InputContainer>
    </SearchInputContainer>
  );
};

export default SRSearchWidget;
