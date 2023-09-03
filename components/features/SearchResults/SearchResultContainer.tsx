import React, { useState, useCallback, useMemo } from "react";
import { useQueryParams } from "use-query-params";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";

import { ResultItems } from "../Header/Header/NavigationBar/GTESearch/GTESearch";
import useOverallSearchQuery from "../Header/Header/NavigationBar/GTESearch/useOverallSearchQuery";

import useOverallSearchPageQuery from "./useOverallSearchPageQuery";
import OverallSearchPageQuery from "./queries/OverallSearchPageQuery.graphql";
import OverallSearchTileCard from "./OverallSearchTileCard";
import PageSearchInputContainer from "./PageSearchInputContainer";
import { SearchResultPageQueryParamScheme } from "./types/SearchResultsQueryParamTypes";
import OverallSearchTileCardSkeleton from "./OverallSearchTileCardSkeleton";
import {
  getPrevPageInfo,
  hasNextPageCheck,
  useCursorPaginationCheck,
  shouldSkipSubheader,
} from "./utils/SearchResultUtils";
import SearchResultPageBreadcrumbsQuery from "./queries/SearchResultPageBreadcrumbsQuery.graphql";
import OverallSearchListCard from "./OverallSearchListCard";
import OverallSearchListCardSkeleton from "./OverallSearchListCardSkeleton";

import DefaultHeadTags from "lib/DefaultHeadTags";
import SEO from "components/features/SEO/SEO";
import Container, { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import Row from "components/ui/Grid/Row";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { SubscribeFormLoading } from "components/features/Footer/FooterWrapper";
import { PageType } from "types/enums";
import GTECommonBreadcrumbs from "components/ui/Breadcrumbs/GTECommonBreadcrumbs";
import useActiveLocale from "hooks/useActiveLocale";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";

export interface PageResultItems extends ResultItems {
  description: string;
  imageSrc: string | null;
  reviewScore?: {
    totalScore: number;
    totalCount: number;
  };
}

interface SearchWithFiltersTypes {
  searchWithFilters: {
    name: string;
    countryCode: string;
    type: string;
    nextPage: string;
    isDefault: boolean;
    googleMetatags: string;
    resultItems: PageResultItems[];
  };
}

const LazySubscribeForm = CustomNextDynamic(
  () => import("components/ui/SubscriptionsForm/SubscribeForm"),
  {
    ssr: false,
    loading: () => <SubscribeFormLoading />,
  }
);

const StyledProductSearchListHeader = styled(ProductSearchListHeader)`
  margin-bottom: 0;
  ${SectionSubHeading} {
    line-height: 22px;
  }
`;

export const filters = {
  funnelTypes: [],
  countryIds: [],
  countryCodes: [],
  countryNames: [],
  cityIds: [],
  cityNames: [],
};

const SearchResultContainer = () => {
  const { t } = useTranslation(Namespaces.overallSearchNs);
  const pageTitle = t("Your search results");
  const noResultsSubHeader = t("No results match your search");

  const useSearchResultPageQueryParams = useQueryParams(SearchResultPageQueryParamScheme);

  const { search, nextPageId, prevPageId } = useSearchResultPageQueryParams[0];

  const [searchInput, setSearchInput] = useState("");
  const isOnTablet = useIsTablet();
  const resultsLimitPerPage = !isOnTablet ? 10 : 9;

  const { data: searchResult } = useOverallSearchQuery(searchInput);

  const { data, loading } = useOverallSearchPageQuery(
    filters,
    resultsLimitPerPage,
    search,
    nextPageId || prevPageId
  );
  const productResultItems = data?.searchWithFilters?.resultItems;
  const productResultItemsLength = productResultItems?.length ?? 0;
  const isNoParams = !search;
  const nextPage = data?.searchWithFilters?.nextPage;
  const hasNextPage = hasNextPageCheck(nextPage, resultsLimitPerPage, nextPageId || prevPageId);
  const previousPageInfo = getPrevPageInfo(resultsLimitPerPage, nextPageId || prevPageId);
  const searchModalData = searchResult?.search?.resultItems;
  const emptyResults = data?.searchWithFilters?.isDefault;
  const useCursorPagination = useCursorPaginationCheck(
    productResultItemsLength,
    resultsLimitPerPage,
    isNoParams,
    emptyResults,
    nextPageId || prevPageId
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.currentTarget.value);
    },
    [setSearchInput]
  );

  const clearSearchInput = useCallback(() => setSearchInput(""), [setSearchInput]);

  const locale = useActiveLocale();

  const { data: breadcrumbData } = useQuery<{
    breadcrumbs: SharedTypes.BreadcrumbData[];
  }>(SearchResultPageBreadcrumbsQuery, {
    variables: {
      where: {
        breadCrumbId: "europe",
      },
      locale,
    },
  });

  const europeTranslated = t("Europe");
  const { data: defaultResult, loading: defaultLoading } = useQuery<SearchWithFiltersTypes>(
    OverallSearchPageQuery,
    {
      variables: {
        input: {
          query: europeTranslated,
          locale,
          nextPage: "1",
          filters,
          limit: 6,
        },
      },
      skip: !isNoParams,
    }
  );

  const productDefaultResultItems = defaultResult?.searchWithFilters?.resultItems;

  const getProducts = useMemo(() => {
    if (emptyResults) {
      return productResultItems?.slice(0, 5);
    }
    if (isNoParams) {
      return productDefaultResultItems;
    }
    return productResultItems;
  }, [emptyResults, isNoParams, productResultItems, productDefaultResultItems]);

  return (
    <>
      <DefaultHeadTags title={pageTitle} />
      <SEO title={pageTitle} description={pageTitle} isIndexed={false} images={[]} hreflangs={[]} />
      <Container>
        <GTECommonBreadcrumbs
          breadcrumbs={breadcrumbData?.breadcrumbs ?? []}
          hideLastBreadcrumb={false}
        />
        <Row>
          <LeftContent>
            <PageSearchInputContainer
              setSearchInput={handleOnChange}
              value={searchInput}
              searchResult={searchModalData}
              clearSearchInput={clearSearchInput}
              searchParam={search}
            />
          </LeftContent>
          <RightContent>
            <SearchProductListContainer<PageResultItems>
              TileCardElement={OverallSearchTileCard}
              TileCardSkeletonElement={OverallSearchTileCardSkeleton}
              ListCardElement={OverallSearchListCard}
              ListCardSkeletonElement={OverallSearchListCardSkeleton}
              loading={(loading || defaultLoading) ?? false}
              numberOfLoadingItems={resultsLimitPerPage}
              products={getProducts ?? []}
              totalProducts={data?.searchWithFilters?.resultItems?.length || 10}
              isCompact
              currentPage={1}
              productListHeader={
                <StyledProductSearchListHeader
                  loading={false}
                  hasFilters={false}
                  skipSubheader={shouldSkipSubheader(emptyResults, isNoParams)}
                  customSubheader={noResultsSubHeader}
                  header={pageTitle}
                />
              }
              pageType={PageType.GTE_SEARCH_RESULTS}
              hasNextPage={hasNextPage || !previousPageInfo.hasPreviousPage}
              hasPreviousPage={previousPageInfo.hasPreviousPage}
              nextPageCursor={nextPage || "1"}
              prevPageCursor={previousPageInfo.prevPageCursor}
              useCursorPagination={useCursorPagination}
            />
          </RightContent>
        </Row>
        <LazySubscribeForm isGTE />
      </Container>
    </>
  );
};

export default SearchResultContainer;
