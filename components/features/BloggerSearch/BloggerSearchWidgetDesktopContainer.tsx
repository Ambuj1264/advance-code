import React, { useContext } from "react";
import styled from "@emotion/styled";

import {
  BloggerSearchPageStateContext,
  BloggerSearchPageCallbackContext,
} from "./BloggerSearchPageStateContext";
import BloggerSearchFilters from "./BloggerSearchFilters";

import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";
import { SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";
import SearchIcon from "components/icons/search.svg";
import Label from "components/ui/SearchWidget/Label";
import Input from "components/ui/Inputs/Input";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import { gutters } from "styles/variables";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";

const ButtonWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const BloggerSearchWidgetDesktopContainer = ({
  bloggerTypeFilters,
  categoriesFilters,
  selectedFilters,
}: {
  categoriesFilters: SearchPageTypes.Filter[];
  bloggerTypeFilters: SearchPageTypes.Filter[];
  selectedFilters: SelectedFilter[];
}) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const { text } = useContext(BloggerSearchPageStateContext);
  const { onInputChange, onSearchClick } = useContext(BloggerSearchPageCallbackContext);
  return (
    <>
      <SearchWidgetDesktop>
        <Label>
          <Trans>Search</Trans>
        </Label>
        <Input
          Icon={SearchIcon}
          placeholder={text || t("Search destinations, attractions or any keywords...")}
          value={text}
          onChange={e => onInputChange(e.target.value)}
          useDebounce={false}
        />
        <ButtonWrapper>
          <SearchWidgetButton onSearchClick={onSearchClick} />
        </ButtonWrapper>
      </SearchWidgetDesktop>
      <BloggerSearchFilters
        bloggerTypeFilters={bloggerTypeFilters}
        categoriesFilters={categoriesFilters}
        selectedFilters={selectedFilters}
      />
    </>
  );
};

export default BloggerSearchWidgetDesktopContainer;
