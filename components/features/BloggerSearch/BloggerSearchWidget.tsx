import React, { useContext, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import BloggerCategoriesQuery from "./queries/BlogCategoriesQuery.graphql";
import useBloggerSearchQueryParams from "./utils/useBloggerSearchQueryParams";
import {
  BloggerSearchPageStateContext,
  BloggerSearchPageCallbackContext,
} from "./BloggerSearchPageStateContext";
import BloggerSearchWidgetModal from "./BloggerSearchWidgetModal";
import BloggerSearchWidgetDesktopContainer from "./BloggerSearchWidgetDesktopContainer";
import BloggerSearchFiltersModal from "./BloggerSearchFiltersModal";
import { constructCategoriesFilter, getBlogSelectedFilters } from "./utils/bloggerSearchUtils";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { PageType } from "types/enums";

const BloggerSearchMobileFooter = CustomNextDynamic(() => import("./BloggerSearchMobileFooter"), {
  ssr: false,
});

const BloggerSearchWidget = ({
  isLoading,
  totalResults,
  typeOfBlogs,
}: {
  isLoading: boolean;
  totalResults: number;
  typeOfBlogs: string;
}) => {
  const { t } = useTranslation(Namespaces.bloggerSearchNs);
  const isMobile = useIsMobile();
  const [{ categoryIds, bloggerType }] = useBloggerSearchQueryParams();
  const { text, isFilterModalOpen, isSearchWidgetModalOpen } = useContext(
    BloggerSearchPageStateContext
  );
  const { onSearchWidgetModalToggle, onFilterModalToggle } = useContext(
    BloggerSearchPageCallbackContext
  );

  const { data } = useQuery<BloggerSearchTypes.QueryBlogCategories>(BloggerCategoriesQuery);

  const categoriesFilters = constructCategoriesFilter(typeOfBlogs, data);

  const bloggerTypeFilters = [
    {
      id: PageType.LOCALCOMMUNITY,
      name: t("Local experts"),
    },
    {
      id: PageType.TRAVELCOMMUNITY,
      name: t("Travellers"),
    },
  ];
  const selectedFilters = useMemo(
    () =>
      getBlogSelectedFilters({
        categoryIds,
        bloggerType,
        categoriesFilters,
        bloggerTypeFilters,
      }),
    [categoryIds, bloggerType, categoriesFilters, bloggerTypeFilters]
  );
  return (
    <>
      {!isMobile && (
        <BloggerSearchWidgetDesktopContainer
          bloggerTypeFilters={bloggerTypeFilters}
          categoriesFilters={categoriesFilters}
          selectedFilters={selectedFilters}
        />
      )}
      {isMobile && (
        <>
          {isSearchWidgetModalOpen && <BloggerSearchWidgetModal />}
          {isFilterModalOpen && (
            <BloggerSearchFiltersModal
              bloggerTypeFilters={bloggerTypeFilters}
              categoriesFilters={categoriesFilters}
              isLoading={isLoading}
              totalResults={totalResults}
              selectedFilters={selectedFilters}
            />
          )}
          <BloggerSearchMobileFooter
            searchText={text}
            onSearchModalButtonClick={onSearchWidgetModalToggle}
            onFilterButtonClick={onFilterModalToggle}
          />
        </>
      )}
    </>
  );
};

export default BloggerSearchWidget;
