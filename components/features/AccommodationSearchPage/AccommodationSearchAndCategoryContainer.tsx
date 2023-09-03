import React, { useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";

import ProductSearchAndCategorySEOContainer from "../SEO/ProductSearchAndCategorySEOContainer";

import AccommodationSearchCategoryQuery from "./queries/AccommodationSearchCategoryQuery.graphql";
import AccommodationDefaultFilterQuery from "./queries/AccommodationSearchDefaultFilterQuery.graphql";
import {
  doesAccommodationSearchHaveFilters,
  constructSearchHotel,
  constructAccommodationCategory,
  constructAccommodationSearchQueryVariables,
  sortAccommodationSearchResults,
  getPrefilledCategoryIdFromSlug,
  filterAccommodationSearchResults,
  getAccommodationQueryParams,
  getAccommodationSelectedFilters,
  getCityFromHotelCategorySearch,
} from "./utils/accommodationSearchUtils";
import { constructAccommodationFilters } from "./utils/accommodationSearchFilterUtils";
import AccommodationSearchQuery from "./queries/AccommodationSearchQuery.graphql";
import useAccommodationSearchQueryParams from "./utils/useAccommodationSearchQueryParams";
import AccommodationSearchContentContainer from "./AccommodationSearchContentContainer";

import {
  getAccommodationCategorySearchItemName,
  getAccommodationCategoryAdminLinks,
} from "components/features/AdminGear/utils";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import useCountry from "hooks/useCountry";
import { AccommodationSearchPageStateContextProvider } from "components/features/AccommodationSearchPage/AccommodationSearchPageStateContext";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { PageType, LandingPageType } from "types/enums";
import Container from "components/ui/Search/SearchGrid";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getSortOptions } from "components/ui/Sort/sortUtils";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import {
  scrollSearchPageToTop,
  useSearchScrollToTopEvents,
} from "components/ui/Search/utils/sharedSearchUtils";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import useMobileFooterState from "hooks/useMobileFooterState";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import { getTotalPages } from "utils/helperUtils";
import { backendControlledCacheHeaders } from "utils/apiUtils";

const AccommodationSearchAndCategoryContainer = ({
  isAccommodationCategory = false,
  slug = "",
  popularAccommodations,
  popularAccommodationsMetadata,
  defaultAccommodations,
  defaultDataLoading,
  defaultTotalAccommodation,
  isHotelCategoryPage,
}: {
  slug?: string;
  isAccommodationCategory?: boolean;
  popularAccommodations?: SharedTypes.Product[];
  popularAccommodationsMetadata?: SharedTypes.QuerySearchMetadata;
  defaultAccommodations?: SharedTypes.Product[];
  defaultDataLoading?: boolean;
  defaultTotalAccommodation?: number;
  isHotelCategoryPage?: boolean;
}) => {
  const AMOUNT_SHOWN_WITH_COVER = 8;

  const isDesktop = useIsDesktop();
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { adminUrl } = useSettings();
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { t } = useTranslation(Namespaces.accommodationSearchNs);

  const [queryParams, setQueryParams] = useAccommodationSearchQueryParams();

  const {
    orderBy,
    orderDirection,
    stars,
    category_ids: categoryIds,
    amenity_ids: amenityIds,
    extra_option_ids: extraIds,
    dateFrom,
    dateTo,
    adults,
    address,
    id,
    children,
    rooms,
    page = 1,
  } = queryParams;

  const hasFilters = doesAccommodationSearchHaveFilters(queryParams);

  const { isMobileFooterShown } = useMobileFooterState(hasFilters || undefined);

  const shouldShowCover = !hasFilters;
  const { country } = useCountry();
  const accommodationSearchQueryFilters = constructAccommodationSearchQueryVariables({
    queryParams,
    country,
    slug,
  });
  const queryParamFilters = {
    stars,
    categoryIds,
    amenityIds,
    extraIds,
  };

  const isPaginatedCategory = !hasFilters && isAccommodationCategory;

  const isAccommodationSearch = isAccommodationCategory ? !isPaginatedCategory : hasFilters;

  const { data: fastSearchData, loading: fastSearchLoading } =
    useQuery<AccommodationSearchTypes.QuerySearchAccommodations>(AccommodationSearchQuery, {
      variables: {
        ...accommodationSearchQueryFilters,
        limit: 24,
        selectionType: "fast",
      },
      skip: !isAccommodationSearch,
      fetchPolicy: "network-only",
      context: {
        headers: backendControlledCacheHeaders,
      },
    });

  const { data: slowSearchData, loading: slowSearchLoading } =
    useQuery<AccommodationSearchTypes.QuerySearchAccommodations>(AccommodationSearchQuery, {
      variables: {
        ...accommodationSearchQueryFilters,
        limit: 100000,
        selectionType: "both",
      },
      skip: !isAccommodationSearch,
      fetchPolicy: "network-only",
      context: {
        headers: backendControlledCacheHeaders,
      },
    });
  const { data: defaultFiltersData } = useQuery<AccommodationSearchTypes.QuerySearchAccommodations>(
    AccommodationDefaultFilterQuery
  );
  const allProvidersLoading = slowSearchLoading && fastSearchLoading;
  const someProviderLoading = slowSearchLoading || fastSearchLoading;
  const combinedFilters: AccommodationSearchTypes.AccommodationFilter[] = [
    ...(fastSearchData?.accommodationSearch?.searchFilters ?? []),
    ...(slowSearchData?.accommodationSearch?.searchFilters ?? []),
  ];
  const hotelQueryParams = isAccommodationSearch
    ? `${getAccommodationQueryParams(adults, children, rooms, dateFrom, dateTo)}`
    : undefined;
  const defaultFilters = defaultFiltersData?.accommodationSearch?.searchFilters ?? [];
  const accommodationResult = slowSearchLoading
    ? (fastSearchData?.accommodationSearch?.accommodations ?? []).map(accommodation =>
        constructSearchHotel(accommodation, true, hotelQueryParams)
      )
    : (slowSearchData?.accommodationSearch?.accommodations ?? []).map(accommodation =>
        constructSearchHotel(accommodation, false, hotelQueryParams)
      );
  const combinedAccommodations = allProvidersLoading ? [] : accommodationResult;

  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        adults,
        children,
        rooms,
        dateFrom,
        dateTo,
        address,
        id,
      },
      QueryParamTypes.PUSH
    );
  }, [setQueryParams, adults, children, rooms, dateFrom, dateTo, address, id]);
  const {
    error: searchCategoryError,
    data: searchCategoryData,
    loading: searchCategoryDateLoading,
  } = useQuery<AccommodationSearchTypes.QueryAccommodationSearchCategoryInfo>(
    AccommodationSearchCategoryQuery,
    { variables: { slug } }
  );

  const filteredAccommodations = filterAccommodationSearchResults(
    combinedAccommodations,
    queryParamFilters
  );
  const totalAccommodations = isAccommodationSearch ? filteredAccommodations?.length : undefined;
  const {
    onTotalProductsChange: onTotalAccommodationsChange,
    onLoadingStateChange,
    onTotalFiltersChange,
    onPageChange,
  } = useSearchScrollToTopEvents({
    totalProducts: totalAccommodations,
    loadingState: fastSearchLoading,
    queryParamFilters,
    page,
  });

  useEffect(() => {
    const jumpScrollOnStartLoading = onLoadingStateChange && !isDesktop && fastSearchLoading;
    const scrollOnFinishFastLoading =
      onLoadingStateChange && onTotalAccommodationsChange && !fastSearchLoading;
    const scrollOnFilterChange = onTotalFiltersChange && onTotalAccommodationsChange;
    const shouldSmoothScroll = scrollOnFinishFastLoading || scrollOnFilterChange || onPageChange;

    if (jumpScrollOnStartLoading) {
      scrollSearchPageToTop({ behavior: "auto" });
    }
    if (shouldSmoothScroll) {
      scrollSearchPageToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    totalAccommodations,
    onTotalAccommodationsChange,
    onLoadingStateChange,
    fastSearchLoading,
    isDesktop,
    onTotalFiltersChange,
    page,
  ]);

  const sortedAccommodations = useMemo(
    () =>
      sortAccommodationSearchResults(filteredAccommodations, orderBy, orderDirection).slice(
        PRODUCT_SEARCH_RESULT_LIMIT * (page - 1),
        PRODUCT_SEARCH_RESULT_LIMIT * page
      ),
    [filteredAccommodations, orderBy, orderDirection, page]
  );

  const searchCategory = searchCategoryData && constructAccommodationCategory(searchCategoryData);

  const constructedFilters = useMemo(
    () =>
      constructAccommodationFilters(
        combinedFilters,
        combinedAccommodations,
        t,
        queryParamFilters,
        searchCategory?.categoryName
      ),
    [combinedFilters, combinedAccommodations, queryParamFilters, searchCategory]
  );

  const selectedFilters = useMemo(
    () =>
      getAccommodationSelectedFilters({
        stars,
        categoryIds,
        amenityIds,
        extraIds,
        filters: constructedFilters,
      }),
    [stars, categoryIds, amenityIds, extraIds, constructedFilters]
  );

  if (
    searchCategoryError ||
    (!searchCategoryData?.hotelSearchCategoryByUri && !searchCategoryDateLoading)
  )
    return null;

  const accommodations =
    isAccommodationSearch && filteredAccommodations?.length > 0
      ? sortedAccommodations
      : popularAccommodations;

  const sortOptions = getSortOptions(theme);
  const adminGearItemName = getAccommodationCategorySearchItemName({
    isAccommodationCategory,
    isAccommodationSearch,
  });
  const adminLinks = getAccommodationCategoryAdminLinks(
    activeLocale,
    adminUrl,
    adminGearItemName,
    searchCategory?.id ?? undefined
  );
  const prefilledCategoryId = getPrefilledCategoryIdFromSlug(
    searchCategoryData?.hotelSearchCategoryByUri?.stringifiedAutoFilter ?? null
  );
  const displayedAccommodation =
    sortedAccommodations?.length > 0 ? sortedAccommodations : defaultAccommodations ?? [];
  const totalDisplayedAccommodations =
    sortedAccommodations?.length > 0 ? totalAccommodations : defaultTotalAccommodation ?? 0;

  const totalPages =
    getTotalPages(
      totalDisplayedAccommodations!,
      hasFilters ? PRODUCT_SEARCH_RESULT_LIMIT : AMOUNT_SHOWN_WITH_COVER
    ) || 1;
  const canonicalQueryParams = page && page > 1 ? `page=${page}` : undefined;
  const city = getCityFromHotelCategorySearch(searchCategoryData);
  return (
    <AccommodationSearchPageStateContextProvider
      defaultLocation={searchCategory?.location}
      slug={slug}
      prefilledCategoryId={prefilledCategoryId}
      isSearchResultsPage={hasFilters && isAccommodationSearch}
    >
      <ProductSearchAndCategorySEOContainer
        isIndexed={!hasFilters && page <= totalPages}
        products={accommodations}
        coverImage={searchCategory?.cover.image}
        canonicalQueryParams={canonicalQueryParams}
        fallbackTitle={searchCategoryData?.hotelSearchCategoryByUri?.categoryName}
      />
      <Container data-testid="accommodationSearchResult">
        <BreadcrumbsContainer
          type={isAccommodationCategory ? PageType.HOTELSEARCHCATEGORY : undefined}
          landingPageType={isAccommodationCategory ? undefined : LandingPageType.HOTELS}
          slug={slug}
          lastCrumb={hasFilters ? commonSearchT("Search results") : undefined}
        />
        <AccommodationSearchContentContainer
          isMobileFooterShown={isMobileFooterShown || hasFilters}
          showFilters={hasFilters && isAccommodationSearch}
          filters={constructedFilters}
          totalAccommodations={totalDisplayedAccommodations}
          searchCategory={searchCategory}
          defaultFilters={defaultFilters}
          shouldShowCover={shouldShowCover}
          partialLoading={{
            someProviderLoading,
            allProvidersLoading,
          }}
          accommodationResult={displayedAccommodation}
          paginationLoading={Boolean(defaultDataLoading)}
          totalPages={totalPages}
          currentPage={page}
          isAccommodationCategory={isAccommodationCategory}
          slug={slug}
          hasFilters={hasFilters}
          popularAccommodations={popularAccommodations}
          popularAccommodationsMetadata={popularAccommodationsMetadata}
          sortOptions={sortOptions}
          onClearFilters={onClearFilters}
          showContent={page === 1 && !isAccommodationSearch}
          selectedFilters={selectedFilters}
          city={city}
          isHotelCategoryPage={isHotelCategoryPage}
        />
      </Container>
      {!hasFilters && (
        <AdminGearLoader
          links={adminLinks}
          slug={slug}
          pageType={PageType.HOTELSEARCHCATEGORY}
          landingPageType={LandingPageType.HOTELS}
        />
      )}
    </AccommodationSearchPageStateContextProvider>
  );
};

export default AccommodationSearchAndCategoryContainer;
