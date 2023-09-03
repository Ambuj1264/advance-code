import React, { useState, useCallback, useEffect } from "react";
import SearchIcon from "@travelshift/ui/icons/search.svg";
import styled from "@emotion/styled";

import SearchInputAndDropdown from "./SearchInputAndDropdown";
import GTEMobileSearch from "./GTEMobileSearch";
import useOverallSearchQuery from "./useOverallSearchQuery";

import { greyColor } from "styles/variables";
import { useIsTablet } from "hooks/useMediaQueryCustom";

export const SearchIconContainer = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const GTESearchIcon = styled(SearchIcon)`
  width: 18px;
  height: 18px;
  path {
    opacity: 0.5;
    fill: ${greyColor};
  }
`;

export type ResultItems = {
  id: string;
  title: string | null;
  destinationId: string | null;
  destinationName: string | null;
  countryName: string | null;
  countryCode: string | null;
  metadataUri: string | null;
  pageVariation: string | null;
  pageType: string | null;
  slug: string | null;
  subResultItems?: ResultItems[];
};

export interface SearchResultsTypes {
  name: string;
  countryCode: string;
  type: string;
  resultItems: ResultItems[];
}

const GTESearch = ({
  isSearchOpen = false,
  toggleSearch,
}: {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!isSearchOpen && searchInput) {
      setSearchInput("");
    }
  }, [isSearchOpen]);

  const { data } = useOverallSearchQuery(searchInput);

  const searchResult = data?.search?.resultItems;

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.currentTarget.value);
    },
    [setSearchInput]
  );

  const isMobileSearchBreakpoint = !useIsTablet();
  return isSearchOpen ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isMobileSearchBreakpoint ? (
        <GTEMobileSearch
          toggleSearch={toggleSearch}
          value={searchInput}
          setSearchInput={handleOnChange}
          searchResult={searchResult}
        />
      ) : (
        <SearchInputAndDropdown
          toggleSearch={toggleSearch}
          value={searchInput}
          setSearchInput={handleOnChange}
          searchResult={searchResult}
        />
      )}
    </>
  ) : (
    <SearchIconContainer onClick={toggleSearch}>
      <GTESearchIcon />
    </SearchIconContainer>
  );
};

export default GTESearch;
