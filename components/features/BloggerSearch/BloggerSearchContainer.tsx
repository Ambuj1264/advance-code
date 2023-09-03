import React, { useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";

import AdminGearLoader from "../AdminGear/AdminGearLoader";
import NoIndex from "../SEO/NoIndex";

import BloggerSearchQuery from "./queries/BloggerSearchQuery.graphql";
import { constructBlogs, constructTypeOfBlogs } from "./utils/bloggerSearchUtils";
import useBloggerSearchQueryParams from "./utils/useBloggerSearchQueryParams";
import BloggerTileCard from "./BloggerTileCard";
import BloggerSearchWidget from "./BloggerSearchWidget";
import { BloggerSearchPageStateContextProvider } from "./BloggerSearchPageStateContext";

import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import DefaultHeadTags from "lib/DefaultHeadTags";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import TeaserSideCardHorizontalSkeleton from "components/ui/Teaser/variants/TeaserSideCardHorizontalSkeleton";
import { ListPlaceRowElement } from "components/ui/Search/ListPlaceCard";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { getBlogSortOptions, bloggerSortParameters } from "components/ui/Sort/sortUtils";
import { PageType, LandingPageType } from "types/enums";
import ListPlaceCardSkeleton from "components/ui/Search/ListPlaceCardSkeleton";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import Row from "components/ui/Grid/Row";
import Container, { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import { useRedirectToPageParam } from "hooks/useRedirect";

const BloggerSearchContainer = () => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { websiteName } = useSettings();
  const { t } = useTranslation(Namespaces.bloggerSearchNs);
  const theme: Theme = useTheme();
  const [{ page = 1, orderBy, categoryIds, text, bloggerType = [] }, setQueryParams] =
    useBloggerSearchQueryParams();
  const typeOfBlogs = constructTypeOfBlogs(bloggerType);
  const { data, loading } = useQuery<{
    searchBlogs: {
      blogs: BloggerSearchTypes.QueryBlog[];
      metadata: {
        totalPages: number;
        totalResults: number;
      };
    };
  }>(BloggerSearchQuery, {
    variables: {
      typeOfBlogs,
      orderBy,
      categoryIds: categoryIds?.map(id => Number(id)),
      page,
      text,
    },
    skip: !bloggerType,
    onCompleted: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  });

  const bloggers = constructBlogs(data?.searchBlogs.blogs ?? []);

  const { totalResults, totalPages } = data?.searchBlogs.metadata || {
    totalResults: 0,
    totalPages: 1,
  };

  useRedirectToPageParam({ loading, page, totalPages, goToPage: 1 });

  const sortOptions = getBlogSortOptions(theme);
  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        text,
      },
      QueryParamTypes.PUSH
    );
  }, [text, setQueryParams]);
  return (
    <>
      <NoIndex />
      <DefaultHeadTags title={websiteName} />
      <BloggerSearchPageStateContextProvider>
        <Container>
          <BreadcrumbsContainer
            landingPageType={
              bloggerType.includes(PageType.LOCALCOMMUNITY) && bloggerType.length === 1
                ? LandingPageType.LOCALBLOGGERS
                : LandingPageType.TRAVELBLOGGERS
            }
            lastCrumb={commonSearchT("Search results")}
          />
          <Row>
            <LeftContent>
              <BloggerSearchWidget
                isLoading={loading}
                totalResults={totalResults}
                typeOfBlogs={typeOfBlogs}
              />
            </LeftContent>
            <RightContent>
              <SearchProductListContainer<BloggerSearchTypes.SearchBlog>
                TileCardElement={BloggerTileCard}
                TileCardSkeletonElement={TeaserSideCardHorizontalSkeleton}
                TileCardSSRSkeletonElement={TeaserSideCardHorizontalSkeleton}
                ListCardElement={ListPlaceRowElement}
                ListCardSkeletonElement={ListPlaceCardSkeleton}
                loading={loading}
                products={bloggers}
                totalProducts={totalResults}
                isCompact
                currentPage={page}
                productListHeader={
                  <ProductSearchListHeader
                    loading={loading}
                    isCompact={false}
                    hasFilters
                    header={t("{totalBlogs} blogs match your search", {
                      totalBlogs: totalResults,
                    })}
                    totalProducts={totalResults}
                    onClearFilters={onClearFilters}
                  />
                }
                pageType={PageType.BLOG}
                sortOptions={sortOptions}
                totalPages={totalPages}
                customSortParams={bloggerSortParameters}
              />
            </RightContent>
          </Row>
        </Container>
      </BloggerSearchPageStateContextProvider>
      <AdminGearLoader />
    </>
  );
};

export default BloggerSearchContainer;
