import React, { ChangeEvent, useCallback, useEffect, useContext, useState, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import ProductSearchAndCategorySEOContainer from "../SEO/ProductSearchAndCategorySEOContainer";

import SearchWidgetContainer from "./Search/SearchWidgetContainer";
import TourSearchQuery from "./queries/TourSearchQuery.graphql";
import CategoryHeaderQuery from "./queries/CategoryHeaderQuery.graphql";
import {
  constructFilters,
  constructSearchTour,
  normalizeCategoryHeaderData,
  getStartingLocationItems,
  constructClientTours,
  getTourQueryParams,
  getTourSelectedFilters,
} from "./utils/searchUtils";
import SearchPageStateContext from "./SearchPageStateContext";
import useTourSearchParams from "./useTourSearchQueryParams";
import useTourAutoCompleteQuery from "./hooks/useTourAutoCompleteQuery";

import { scrollSearchPageToTop } from "components/ui/Search/utils/sharedSearchUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { ListProductRowElement } from "components/ui/Search/ListProductCard";
import { TileProductCardGridElement } from "components/ui/Search/TileProductCard";
import TileProductCardSkeleton, {
  TileProductSSRSkeletonGridElement,
} from "components/ui/Search/TileProductCardSkeleton";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import useActiveLocale from "hooks/useActiveLocale";
import Row from "components/ui/Grid/Row";
import { LandingPageType, PageType } from "types/enums";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { useSettings } from "contexts/SettingsContext";
import {
  getTourCategoryAdminLinks,
  getTourCategorySearchItemName,
} from "components/features/AdminGear/utils";
import useToggle from "hooks/useToggle";
import useMobileFooterState from "hooks/useMobileFooterState";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getTourSortOptions } from "components/ui/Sort/sortUtils";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import { useRedirectToPageParam } from "hooks/useRedirect";
import { shortCacheHeaders } from "utils/apiUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import useQueryClient from "hooks/useQueryClient";

const TourSearchAndCategoryContainer = ({
  slug,
  landingPageType,
  isTourCategory = false,
  defaultFilters,
}: {
  slug?: string;
  landingPageType?: LandingPageType;
  isTourCategory?: boolean;
  defaultFilters?: SearchPageTypes.Filters;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const isDesktop = useIsDesktop();
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { adminUrl } = useSettings();
  const [hasSelectedLocation, toggleHasSelectedLocation] = useToggle(false);
  const { t: tourT } = useTranslation(Namespaces.tourSearchNs);
  const { t: commonT } = useTranslation();
  const [
    {
      orderBy,
      orderDirection,
      durationIds,
      activityIds,
      attractionIds,
      startingLocationId,
      startingLocationName,
      adults,
      children,
      childrenAges,
      dateFrom,
      dateTo,
      page,
      price,
    },
    setQueryParams,
  ] = useTourSearchParams();

  const hasPageFilter = Boolean(
    orderBy ||
      orderDirection ||
      durationIds ||
      activityIds ||
      attractionIds ||
      startingLocationName ||
      startingLocationId ||
      (adults && adults > 0) ||
      children !== undefined ||
      dateFrom ||
      dateTo ||
      price
  );

  const { isMobileFooterShown } = useMobileFooterState(hasPageFilter || undefined);

  const [searchTours, setTours] = useState<SharedTypes.Product[]>([]);

  const { setContextState, startingLocationItems, adultsFilter } =
    useContext(SearchPageStateContext);

  const { fetchTourAutoComplete } = useTourAutoCompleteQuery({
    onCompleted: tourStartingLocations => {
      setContextState(
        getStartingLocationItems({
          startingLocationsResult: tourStartingLocations,
        })
      );
    },
  });

  const dateRange = (dateFrom || dateTo) && {
    from: dateFrom,
    to: dateTo,
  };

  const minChildrenAge = [Math.min(...(childrenAges || []))];
  const {
    error: categoryHeaderError,
    data: categoryHeaderRawData,
    loading: isCategoryHeaderLoading,
  } = useQuery<SearchPageTypes.QueryCategoryHeader>(CategoryHeaderQuery, {
    variables: { slug },
  });

  const tourSearchQueryFilters = {
    limit: PRODUCT_SEARCH_RESULT_LIMIT,
    orderBy: orderBy?.toUpperCase(),
    orderDirection: orderDirection?.toUpperCase(),
    durationIds,
    activityIds,
    attractionIds,
    startingLocationId,
    adults,
    childrenAges: childrenAges && childrenAges.length > 0 ? minChildrenAge : undefined,
    dateRange,
    page,
    price,
    ...(slug ? { categorySlug: slug } : {}),
  };

  const tourQueryParams = getTourQueryParams(
    adults,
    children,
    childrenAges,
    dateFrom,
    dateTo,
    startingLocationId,
    startingLocationName
  );

  const numberOfTravelers = (adults ?? adultsFilter) + (children ?? 0);
  const {
    error: searchError,
    data: searchData,
    loading: searchLoading,
  } = useQueryClient<SearchPageTypes.QuerySearchTours>(TourSearchQuery, {
    variables: {
      filters: tourSearchQueryFilters,
    },
    context: {
      headers: shortCacheHeaders,
    },
    onCompleted: fetchedData => {
      const { tourSearch: { filters: { startingLocations = [] } = {} } = {} } = fetchedData;
      const hasStartingLocations = startingLocations.length > 0;
      setTours(
        fetchedData?.tourSearch?.tours.map(tour => constructSearchTour(tour, tourQueryParams)) ?? []
      );

      if (hasStartingLocations) {
        setContextState(
          getStartingLocationItems({
            startingLocationsResult: startingLocations,
            defaultSelectedLocation:
              startingLocationId && startingLocationName
                ? {
                    id: startingLocationId,
                    name: startingLocationName,
                  }
                : undefined,
          })
        );
      }
    },
  });

  const customStartingLocations = searchData?.tourSearch?.filters.startingLocations;
  const onLocationInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (
        (e.target.value === "" && hasSelectedLocation) ||
        (e.target.value !== "" && !hasSelectedLocation)
      ) {
        toggleHasSelectedLocation();
      }

      if (!e.target.value) {
        setContextState({
          selectedLocationId: undefined,
          selectedLocationName: undefined,
          startingLocationItems: customStartingLocations ?? startingLocationItems,
        });
      } else {
        fetchTourAutoComplete({
          name: hasSelectedLocation ? e.target.value : "",
        });
      }
    },
    [
      hasSelectedLocation,
      toggleHasSelectedLocation,
      customStartingLocations,
      startingLocationItems,
      setContextState,
      fetchTourAutoComplete,
    ]
  );

  const prevSearchTours = usePreviousState(searchTours);
  const onTotalSearchToursChange =
    prevSearchTours !== undefined && prevSearchTours.length > 0 && searchTours !== prevSearchTours;

  const filters = useMemo(
    () => constructFilters(defaultFilters, searchData?.tourSearch?.filters),
    [defaultFilters, searchData]
  );

  const selectedFilters = useMemo(
    () =>
      getTourSelectedFilters({
        durationIds,
        activityIds,
        attractionIds,
        price,
        currencyCode,
        convertCurrency,
        filters,
      }),
    [durationIds, activityIds, attractionIds, filters, price, currencyCode, convertCurrency]
  );
  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        dateFrom,
        dateTo,
        adults,
        children,
        childrenAges,
        startingLocationId,
        startingLocationName,
      },
      QueryParamTypes.PUSH
    );
  }, [
    dateFrom,
    dateTo,
    adults,
    children,
    childrenAges,
    startingLocationId,
    startingLocationName,
    setQueryParams,
  ]);

  useEffect(() => {
    if (!isDesktop && searchLoading) {
      scrollSearchPageToTop({ behavior: "auto" });
    }
    if (onTotalSearchToursChange && !searchLoading) {
      scrollSearchPageToTop();
    }
  }, [onTotalSearchToursChange, searchLoading, isDesktop]);

  const totalPages = searchData?.tourSearch?.totalPages ?? 1;

  useRedirectToPageParam({
    loading: searchLoading,
    page,
    totalPages,
    goToPage: 1,
  });

  if (
    (!categoryHeaderRawData?.tourCategoryHeader && !isCategoryHeaderLoading) ||
    categoryHeaderError
  ) {
    return (
      <ErrorComponent error={categoryHeaderError} componentName="TourSearchAndCategoryContainer" />
    );
  }

  const tours =
    searchTours.length > 0
      ? searchTours
      : constructClientTours(searchData?.tourSearch?.tours || [], undefined, tourQueryParams);

  // eslint-disable-next-line prefer-destructuring
  const totalTours = searchData?.tourSearch?.totalTours;

  const categoryHeaderData =
    categoryHeaderRawData && normalizeCategoryHeaderData(categoryHeaderRawData);

  const sortOptions = getTourSortOptions(theme);

  const adminGearItemName = getTourCategorySearchItemName({
    isTourCategory,
    isTourSearch: true,
  });
  const categoryId = categoryHeaderRawData?.tourCategoryHeader?.id;
  const adminLinks = getTourCategoryAdminLinks(
    activeLocale,
    adminUrl,
    adminGearItemName,
    categoryId
  );

  return (
    <>
      <ProductSearchAndCategorySEOContainer
        isIndexed={!hasPageFilter && page <= totalPages}
        products={tours}
        coverImage={categoryHeaderData?.images[0]}
        canonicalQueryParams={page > 1 ? `page=${page}` : undefined}
      />
      <Row>
        <LeftContent>
          <LazyHydrateWrapper whenVisible key="searchWidget">
            <SearchWidgetContainer
              filters={filters}
              totalTours={totalTours}
              isLoading={searchLoading}
              onLocationInputChange={onLocationInputChange}
              isMobileFooterShown={isMobileFooterShown}
              selectedFilters={selectedFilters}
            />
          </LazyHydrateWrapper>
        </LeftContent>
        <RightContent>
          {!searchError && (
            <SearchProductListContainer<SharedTypes.Product>
              TileCardElement={TileProductCardGridElement}
              TileCardSkeletonElement={TileProductCardSkeleton}
              TileCardSSRSkeletonElement={TileProductSSRSkeletonGridElement}
              ListCardElement={ListProductRowElement}
              ListCardSkeletonElement={ListProductCardSkeleton}
              loading={searchLoading}
              products={tours}
              totalProducts={totalTours}
              isCompact
              currentPage={page}
              productListHeader={
                <ProductSearchListHeader
                  loading={searchLoading}
                  hasFilters={selectedFilters.length > 0}
                  totalProducts={totalTours}
                  onClearFilters={onClearFilters}
                  header={tourT("{numberOfTours} tours match your search", {
                    numberOfTours: totalTours ?? 0,
                  })}
                />
              }
              pageType={PageType.TOUR}
              sortOptions={sortOptions}
              totalPages={totalPages}
              priceSubtitle={
                numberOfTravelers
                  ? commonT("Price for {numberOfTravelers} travelers", {
                      numberOfTravelers,
                    })
                  : undefined
              }
            />
          )}
        </RightContent>
      </Row>
      <AdminGearLoader
        links={adminLinks}
        pageType={PageType.TOURCATEGORY}
        slug={slug}
        landingPageType={landingPageType}
      />
    </>
  );
};

export default TourSearchAndCategoryContainer;
