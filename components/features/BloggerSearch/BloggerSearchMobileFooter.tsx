import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SearchIcon from "components/icons/search.svg";
import MobileStickyFooter from "components/ui/StickyFooter/MobileStickyFooter";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";
import {
  MobileFooterButton,
  MobileFooterFilterButton,
} from "components/ui/Filters/MobileFooterButton";
import { SharedFilterQueryParams } from "types/enums";
import { whiteColor, gutters } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { useTranslation } from "i18n";

const SearchIconStyled = styled(SearchIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 16px;
  min-width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const SearchModalButtonWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.span([
  singleLineTruncation,
  css`
    max-width: 100%;
  `,
]);

const SearchModalButton = ({
  onClick,
  searchText,
}: {
  onClick: () => void;
  searchText: string;
}) => {
  const { t } = useTranslation();
  return (
    <MobileFooterButton onClick={onClick} color="action">
      <SearchModalButtonWrapper>
        <SearchIconStyled />
        <Text>
          <TextDateRangeFromQuery
            from={SharedFilterQueryParams.DATE_FROM}
            to={SharedFilterQueryParams.DATE_TO}
          >
            {searchText || t("Search")}
          </TextDateRangeFromQuery>
        </Text>
      </SearchModalButtonWrapper>
    </MobileFooterButton>
  );
};

const BloggerSearchMobileFooter = ({
  searchText,
  onSearchModalButtonClick,
  onFilterButtonClick,
  numberOfSelectedFilters,
}: {
  searchText: string;
  onSearchModalButtonClick: () => void;
  onFilterButtonClick: () => void;
  numberOfSelectedFilters?: number;
}) => {
  return (
    <MobileStickyFooter
      leftContent={<SearchModalButton onClick={onSearchModalButtonClick} searchText={searchText} />}
      rightContent={
        <MobileFooterFilterButton
          onClick={onFilterButtonClick}
          numberOfSelectedFilters={numberOfSelectedFilters}
        />
      }
    />
  );
};

export default BloggerSearchMobileFooter;
