import React, { useCallback } from "react";
import styled from "@emotion/styled";
import SearchIcon from "@travelshift/ui/icons/search.svg";
import rgba from "polished/lib/color/rgba";
import { useRouter } from "next/router";

import SearchResults, { lightBlueColorWithOpacity } from "./SearchResults";
import { ResultItems } from "./GTESearch";

import { getClientSideUrl } from "utils/helperUtils";
import { PageType, Marketplace } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import {
  gutters,
  lightBlueColor,
  greyColor,
  fontSizeBody2,
  fontSizeCaption,
  borderRadiusSmall,
} from "styles/variables";
import ContentDropdown, {
  DropdownContainer,
  DropdownContentWrapper,
  DisplayValue,
} from "components/ui/Inputs/ContentDropdown";
import { ClearIcon } from "components/ui/Inputs/Input";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin, mqMax } from "styles/base";

export const InputSearch = styled.input`
  box-shadow: none;
  border: 1px solid ${lightBlueColor};
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 32px;
  padding-right: ${gutters.small / 2}px;
  padding-left: 34px;
  color: ${greyColor};
  font-size: ${fontSizeCaption};
  caret-color: ${lightBlueColor};

  &:focus {
    outline: none;
  }

  ${mqMin.large} {
    border: none;
    width: 500px;
    padding-right: ${gutters.large * 2}px;
    background: ${lightBlueColorWithOpacity};
    font-size: ${fontSizeBody2};
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  margin: 0 ${gutters.small}px;
  width: 100%;

  ${InputSearch}::placeholder {
    color: ${rgba(greyColor, 0.7)};
  }
  ${mqMin.large} {
    margin: 0;
  }
`;

export const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  margin: auto 0;
  width: 16px;
  cursor: auto;
  fill: ${lightBlueColor};
`;

export const SearchClearWrapper = styled.button`
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  margin: auto 0;
  width: ${gutters.small}px;
`;

const SearchContentDropdown = styled(ContentDropdown)`
  padding: 0;

  ${DisplayValue} {
    border: none;
    padding: 0;
  }

  ${DropdownContentWrapper} {
    padding: 0;
  }

  ${mqMin.large} {
    margin: 0 0 ${gutters.small / 4}px 0;

    ${DropdownContainer} {
      margin: -13px 0;
      max-width: 500px;
      overflow: hidden;
    }
  }

  ${mqMax.large} {
    ${DropdownContainer} {
      box-shadow: none;
      border: none;
    }
  }
`;

const StyledClearIcon = styled(ClearIcon)`
  width: 12px;
  height: 12px;
`;

const SearchInputAndDropdown = ({
  toggleSearch,
  value,
  setSearchInput,
  searchResult,
  isOnMobile,
  className,
}: {
  toggleSearch?: () => void;
  value: string;
  setSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchResult?: ResultItems[];
  isOnMobile?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.commonNs);
  const inputRefCallback = useCallback(inputElement => {
    setTimeout(() => {
      if (inputElement) {
        inputElement.setSelectionRange(-1, -1);
        inputElement.focus();
      }
    }, 100);
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = useCallback(() => {}, []);

  const showSearchResults = Boolean(searchResult?.[0] && value.length > 2);

  const router = useRouter();
  const activeLocale = useActiveLocale();

  const navigateToSearchResultPage = () => {
    const link = `${getClientSideUrl(
      PageType.GTE_SEARCH_RESULTS,
      activeLocale,
      Marketplace.GUIDE_TO_EUROPE
    )}?nextPageId=1&search=${value}`;
    if (link === decodeURI(router.asPath).slice(1)) {
      router.push(`${link}%20`);
    }
    router.push(link);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 && value.length > 2) {
      navigateToSearchResultPage();
    }
  };

  return (
    <SearchContentDropdown
      id="search-input"
      onOutsideClick={toggleSearch}
      displayValue={
        <InputWrapper>
          <InputSearch
            onChange={setSearchInput}
            onKeyDown={handleOnKeyDown}
            value={value}
            placeholder={t("Search")}
            ref={inputRefCallback}
          />
          <StyledSearchIcon />
          {!isOnMobile && (
            <SearchClearWrapper onClick={toggleSearch}>
              <StyledClearIcon />
            </SearchClearWrapper>
          )}
        </InputWrapper>
      }
      isContentOpen={showSearchResults}
      toggleContent={noop}
      shouldDisplayArrowIcon={false}
      className={className}
    >
      <SearchResults searchResult={searchResult} value={value} toggleSearch={toggleSearch} />
    </SearchContentDropdown>
  );
};

export default SearchInputAndDropdown;
