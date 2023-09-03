import React from "react";

import { BloggerSearchQueryParam } from "./utils/useBloggerSearchQueryParams";

import FilterSection from "components/ui/Filters/FilterSection";
import EditIcon from "components/icons/pencil-write-alternate.svg";
import UserSearchIcon from "components/icons/user-search.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterType } from "types/enums";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";
import SelectedFiltersContainer from "components/ui/Filters/SelectedFiltersContainer";

const BloggerSearchFilters = ({
  bloggerTypeFilters,
  categoriesFilters,
  selectedFilters,
}: {
  bloggerTypeFilters: SearchPageTypes.Filter[];
  categoriesFilters: SearchPageTypes.Filter[];
  selectedFilters: SelectedFilter[];
}) => {
  const { t } = useTranslation(Namespaces.bloggerSearchNs);
  return (
    <>
      <SelectedFiltersContainer filters={selectedFilters} />
      <FilterSection
        filters={bloggerTypeFilters}
        title={t("Bloggers")}
        Icon={UserSearchIcon}
        sectionId={BloggerSearchQueryParam.BLOGGERTYPE}
        filterType={FilterType.CHECKBOX}
        resetPageOnFilterSelection
        canSearchInsideFilters
      />
      {categoriesFilters.length > 0 && (
        <FilterSection
          filters={categoriesFilters}
          Icon={EditIcon}
          title={t("Top tags")}
          sectionId={BloggerSearchQueryParam.CATEGORYIDS}
          filterType={FilterType.CHECKBOX}
          canSearchInsideFilters
          resetPageOnFilterSelection
        />
      )}
    </>
  );
};

export default BloggerSearchFilters;
