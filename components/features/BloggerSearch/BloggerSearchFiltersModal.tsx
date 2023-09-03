import React, { useContext } from "react";

import { BloggerSearchPageCallbackContext } from "./BloggerSearchPageStateContext";
import BloggerSearchFilters from "./BloggerSearchFilters";

import { SelectedFilter } from "components/ui/Filters/FilterTypes";
import FilterModal from "components/ui/Filters/FilterModal";

const BloggerSearchWidgetFiltersModal = ({
  bloggerTypeFilters,
  categoriesFilters,
  isLoading,
  totalResults,
  selectedFilters,
}: {
  bloggerTypeFilters: SearchPageTypes.Filter[];
  categoriesFilters: SearchPageTypes.Filter[];
  isLoading: boolean;
  totalResults: number;
  selectedFilters: SelectedFilter[];
}) => {
  const { onFilterModalToggle } = useContext(BloggerSearchPageCallbackContext);

  return (
    <FilterModal onClose={onFilterModalToggle} isLoading={isLoading} totalResults={totalResults}>
      <BloggerSearchFilters
        bloggerTypeFilters={bloggerTypeFilters}
        categoriesFilters={categoriesFilters}
        selectedFilters={selectedFilters}
      />
    </FilterModal>
  );
};

export default BloggerSearchWidgetFiltersModal;
