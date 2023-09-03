import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";
import { range } from "fp-ts/lib/Array";

import {
  getCarSortingOptions,
  constructCarSearch,
  constructCarFilters,
  sortCarSearchResults,
  filterCarSearchResults,
  constructCarProducts,
  carsListImgixParams,
  constructCombinedFilters,
  getCarSelectedFilters,
} from "./utils/carSearchUtils";
import useCarSearch from "./useCarSearch";
import CarSearchWidgetContainer from "./CarSearchWidgetContainer";
import useCarSearchQueryParams from "./useCarSearchQueryParams";

import { useGlobalContext } from "contexts/GlobalContext";
import CarSearchWidgetProvider from "components/ui/CarSearchWidget/CarSearchWidgetProvider";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import SearchProductListView from "components/ui/Search/SearchProductListView";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import { useSettings } from "contexts/SettingsContext";
import useMobileFooterState from "hooks/useMobileFooterState";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { column } from "styles/base";
import Row from "components/ui/Grid/Row";
import { PageType, PageLayout, OrderBy, OrderDirection } from "types/enums";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { getFormattedDate, isoFormat } from "utils/dateUtils";
import {
  scrollSearchPageToTop,
  useSearchScrollToTopEvents,
} from "components/ui/Search/utils/sharedSearchUtils";
import { ListProductRowElement } from "components/ui/Search/ListProductCard";
import { TileProductCardGridElement } from "components/ui/Search/TileProductCard";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import TileProductCardSkeleton, {
  TileProductSSRSkeletonGridElement,
} from "components/ui/Search/TileProductCardSkeleton";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { getTotalPages } from "utils/helperUtils";
import { useRedirectToPageParam } from "hooks/useRedirect";
import {
  constructSelectedDatesFromQuery,
  constructQueryFromSelectedDates,
  getDatesInFuture,
} from "components/ui/DatePicker/utils/datePickerUtils";
import useToggle from "hooks/useToggle";
import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useActiveLocale from "hooks/useActiveLocale";

const LeftContent = styled.div(column({ small: 1, large: 3 / 12 }));
const RightContent = styled.div(column({ small: 1, medium: 1, large: 9 / 12 }));

const CarSearchContainer = ({
  slug,
  defaultPickupId,
  defaultDropoffId,
  carProductUrl,
}: {
  slug: string;
  defaultPickupId?: string;
  defaultDropoffId?: string;
  carProductUrl?: string;
}) => {
  // used for the filters etc.
  const { t: carSearchT } = useTranslation(Namespaces.carSearchNs);
  // used for the car products
  const { t } = useTranslation(Namespaces.commonCarNs);

  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const theme: Theme = useTheme();
  const { marketplace } = useSettings();
  const [isLoading, toggleLoading] = useToggle(true);
  const [filters, setFilters] = useState([] as FilterSectionListType);

  const [isFilterModalOpen, toggleFilterModal] = useToggle(false);
  const [canDisplayRightColumn, setDisplayRightColumn] = useToggle(true);
  const isMobile = useIsMobile();
  const activeLocale = useActiveLocale();

  // this decorator wraps up the modal open/close behavior on mobile.
  // on mobile, we hide the right column due to it impacts the render of the whole
  // page on low budget devices.
  // Then we need some time to re-render it the right-column
  // that's why you see some timeouts here
  const toggleFilterModalDecorator = useCallback(
    isModalOpen => {
      if (!isMobile) toggleFilterModal(isModalOpen);
      if (isModalOpen) {
        toggleFilterModal(isModalOpen);
        // hide of the right column on mobile - saves us ~50% of the filters render time
        setTimeout(() => setDisplayRightColumn(false), 500);
      } else {
        setDisplayRightColumn(true);
        setTimeout(() => toggleFilterModal(isModalOpen), 250);
      }
    },
    [isMobile, setDisplayRightColumn, toggleFilterModal]
  );

  const [carProductsState, setCarProductsState] = useState({
    filteredSearchCars: [] as CarSearchTypes.CarSearch[],
    carProducts: [] as SharedTypes.Product[],
  });

  const sortOptions = useMemo(() => getCarSortingOptions(theme), [theme]);
  const customSortParams = useMemo(
    () => [
      { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.ASC },
      { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.DESC },
      { orderBy: OrderBy.RATING, orderDirection: OrderDirection.DESC },
      {
        orderBy: OrderBy.POPULARITY,
        orderDirection: OrderDirection.DESC,
      },
    ],
    []
  );

  const [
    {
      dateFrom,
      dateTo,
      pickupId,
      dropoffId,
      pickupGeoLocation,
      dropoffGeoLocation,
      orderBy,
      orderDirection,
      carType,
      includedInsurances,
      seats,
      supplier,
      carFeatures,
      depositAmount,
      includedExtras,
      supplierLocation,
      fuelPolicy,
      fuelType,
      milage,
      driverAge,
      driverCountryCode,
      page,
      pickupLocationName,
      dropoffLocationName,
      editCarOfferCartId,
    },
    setQueryParams,
  ] = useCarSearchQueryParams();
  const { fromDate, toDate } = getDatesInFuture(dateFrom, dateTo, true);
  const selectedDatesFromQuery = useMemo(
    () =>
      constructSelectedDatesFromQuery({
        dateFrom: fromDate,
        dateTo: toDate,
        withTime: true,
      }),
    [fromDate, toDate]
  );

  const hasFilters = Boolean(
    fromDate || toDate || pickupId || dropoffId || orderBy || editCarOfferCartId
  );

  const { isMobileFooterShown } = useMobileFooterState(hasFilters || undefined);

  const queryParamFilters = useMemo(
    () => ({
      carType,
      includedInsurances,
      fuelType,
      seats,
      supplier,
      carFeatures,
      includedExtras,
      depositAmount,
      supplierLocation,
      fuelPolicy,
      milage,
    }),
    [
      carFeatures,
      carType,
      depositAmount,
      fuelPolicy,
      fuelType,
      includedExtras,
      includedInsurances,
      milage,
      seats,
      supplier,
      supplierLocation,
    ]
  );

  const currentFilters = useMemo(
    () => ({ ...queryParamFilters, orderBy, orderDirection, page }),
    [orderBy, orderDirection, page, queryParamFilters]
  );

  const prevFilters = usePreviousState(currentFilters);
  const hasNewFiltersAvailable = prevFilters !== currentFilters;

  useEffect(() => {
    if (hasNewFiltersAvailable && !isLoading) {
      toggleLoading(true);
    }
  }, [hasNewFiltersAvailable, isLoading, toggleLoading, orderBy, orderDirection]);

  const carSelectedDates = useMemo(
    () =>
      constructSelectedDatesFromQuery({
        dateFrom: fromDate,
        dateTo: toDate,
        withTime: true,
      }),
    [fromDate, toDate]
  );
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();

  const carSearchQueryFilters: CarSearchTypes.CarSearchQueryFilters = useMemo(
    () => ({
      slug,
      pickupLocationId: pickupId,
      returnLocationId: dropoffId,
      geoLocationPickupId: pickupGeoLocation,
      geoLocationReturnId: dropoffGeoLocation,
      from: carSelectedDates.from && getFormattedDate(carSelectedDates.from, isoFormat),
      to: carSelectedDates.to && getFormattedDate(carSelectedDates.to, isoFormat),
      driverAge: String(driverAge),
      sourceCountry: driverCountryCode,
    }),
    [
      carSelectedDates.from,
      carSelectedDates.to,
      driverAge,
      driverCountryCode,
      dropoffGeoLocation,
      dropoffId,
      pickupGeoLocation,
      pickupId,
      slug,
    ]
  );

  // TODO: add force english var to search query
  const { combinedCars, combinedFilters, allProvidersLoading, someProviderLoading } = useCarSearch(
    carSearchQueryFilters,
    hasFilters
  );

  useEffect(() => {
    if (!isLoading && allProvidersLoading && !combinedCars) {
      toggleLoading(true);
    }
  }, [allProvidersLoading, isLoading, toggleLoading]);

  const partialLoading = useMemo(
    () => ({
      someProviderLoading,
      allProvidersLoading,
    }),
    [allProvidersLoading, someProviderLoading]
  );

  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        dateFrom,
        dateTo,
        pickupId,
        dropoffId,
        pickupGeoLocation,
        dropoffGeoLocation,
        driverAge,
        driverCountryCode,
        pickupLocationName,
        dropoffLocationName,
        page: undefined,
      },
      QueryParamTypes.PUSH
    );
  }, [
    setQueryParams,
    dateFrom,
    dateTo,
    pickupId,
    dropoffId,
    pickupGeoLocation,
    dropoffGeoLocation,
    driverAge,
    driverCountryCode,
    pickupLocationName,
    dropoffLocationName,
  ]);

  const handleSearchClick = useCallback(
    (
      selectedDates: SharedTypes.SelectedDates,
      selectedPickupId?: string,
      selectedDropoffId?: string,
      selectedPickupGeoLocation?: string,
      selectedDropoffGeoLocation?: string,
      selectedDriverAge?: number,
      selectedDriverCountry?: string,
      selectedDropoffLocationName?: string,
      selectedPickupLocationName?: string,
      selectedCarLocationType?: string
    ) => {
      isMobileSearchWidgetBtnClicked.current = true;

      setQueryParams(
        {
          ...constructQueryFromSelectedDates({
            ...selectedDates,
            withTime: true,
          }),
          dropoffId: selectedDropoffId,
          pickupId: selectedPickupId,
          pickupGeoLocation: selectedPickupGeoLocation,
          dropoffGeoLocation: selectedDropoffGeoLocation,
          driverAge: selectedDriverAge,
          driverCountryCode: selectedDriverCountry,
          pickupLocationName: selectedPickupLocationName,
          dropoffLocationName: selectedDropoffLocationName,
          editCarOfferCartId,
          page: undefined,
          carLocationType: selectedCarLocationType,
        },
        QueryParamTypes.PUSH
      );
    },
    [editCarOfferCartId, isMobileSearchWidgetBtnClicked, setQueryParams]
  );

  const searchCars = useMemo(() => {
    const cars =
      carProductUrl && pickupId && dropoffId && pickupLocationName && dropoffLocationName
        ? constructCarSearch(
            t,
            {
              selectedDates: carSelectedDates,
              pickupId,
              dropoffId,
              pickupLocationName,
              dropoffLocationName,
            },
            combinedCars,
            marketplace,
            convertCurrency,
            currencyCode,
            activeLocale,
            driverAge,
            driverCountryCode,
            carProductUrl,
            editCarOfferCartId
          )
        : [];

    return cars;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    carProductUrl,
    carSelectedDates,
    combinedCars,
    driverAge,
    driverCountryCode,
    dropoffId,
    dropoffLocationName,
    editCarOfferCartId,
    marketplace,
    pickupId,
    pickupLocationName,
    // do not enable this hook as dependency here as it causes re-renders
    // convertCurrency,
    currencyCode,
    t,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (allProvidersLoading || someProviderLoading) return;
      const tmpCombinedFilters = constructCombinedFilters(combinedFilters);

      const carSearchFilters = constructCarFilters(
        tmpCombinedFilters,
        searchCars,
        queryParamFilters,
        carSearchT
      );

      setFilters(carSearchFilters);
    }, 0);

    return () => clearTimeout(timer);
  }, [
    allProvidersLoading,
    carSearchT,
    combinedFilters,
    queryParamFilters,
    searchCars,
    someProviderLoading,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (allProvidersLoading) return;
      const filteredCars = filterCarSearchResults(searchCars, queryParamFilters);

      const sortedCars = sortCarSearchResults(
        filteredCars,
        orderBy as OrderBy,
        orderDirection as OrderDirection
      ).slice(PRODUCT_SEARCH_RESULT_LIMIT * (page - 1), PRODUCT_SEARCH_RESULT_LIMIT * page);
      const carProducts = constructCarProducts(sortedCars, currencyCode);

      setCarProductsState({
        carProducts,
        filteredSearchCars: filteredCars,
      });
      // magic number to avoid blinks between loading true/false on fast devices
      setTimeout(() => toggleLoading(false), 350);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [
    allProvidersLoading,
    combinedFilters,
    currencyCode,
    isLoading,
    hasNewFiltersAvailable,
    orderBy,
    orderDirection,
    page,
    queryParamFilters,
    searchCars,
    someProviderLoading,
    toggleLoading,
  ]);

  const totalCars = isLoading ? 0 : carProductsState.filteredSearchCars.length ?? 0;
  // this is a hotfix for displaying 0 results before displaying the car results
  const noCarsToDisplay = totalCars === 0 && searchCars.length > 0;
  const selectedFilters = useMemo(
    () =>
      getCarSelectedFilters({
        carType,
        includedInsurances,
        fuelType,
        seats,
        supplier,
        carFeatures,
        includedExtras,
        depositAmount,
        supplierLocation,
        fuelPolicy,
        milage,
        filters,
        currencyCode,
        convertCurrency,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      carType,
      includedInsurances,
      fuelType,
      seats,
      supplier,
      carFeatures,
      includedExtras,
      depositAmount,
      supplierLocation,
      fuelPolicy,
      milage,
      filters,
      currencyCode,
    ]
  );
  const {
    onTotalProductsChange: onTotalCarsChange,
    onLoadingStateChange,
    onTotalFiltersChange,
    onPageChange,
  } = useSearchScrollToTopEvents({
    totalProducts: totalCars,
    loadingState: allProvidersLoading,
    page,
  });

  useEffect(() => {
    if (!isLoading) {
      const scrollOnFilterChange = onTotalFiltersChange && onTotalCarsChange;
      const shouldSmoothScroll = onTotalCarsChange || scrollOnFilterChange || onPageChange;

      if (shouldSmoothScroll) {
        scrollSearchPageToTop();
      }
    }
  }, [
    totalCars,
    onLoadingStateChange,
    onTotalFiltersChange,
    page,
    allProvidersLoading,
    onTotalCarsChange,
    onPageChange,
    isLoading,
  ]);

  const totalPages = getTotalPages(totalCars, PRODUCT_SEARCH_RESULT_LIMIT) || 1;

  useRedirectToPageParam({
    loading: someProviderLoading || isLoading,
    page,
    totalPages,
  });

  return (
    <Row>
      <LeftContent>
        <CarSearchWidgetProvider
          selectedDates={selectedDatesFromQuery}
          pickupId={pickupId || defaultPickupId}
          dropoffId={dropoffId || defaultDropoffId}
          pickupGeoLocation={pickupGeoLocation}
          dropoffGeoLocation={dropoffGeoLocation}
          queryDriverAge={driverAge}
          queryDriverCountry={driverCountryCode}
          pickupLocationName={pickupLocationName}
          dropoffLocationName={dropoffLocationName}
          onSearchClick={handleSearchClick}
        >
          <CarSearchWidgetContainer
            filters={filters}
            selectedFilters={selectedFilters}
            loading={someProviderLoading}
            isMobileFooterShown={isMobileFooterShown}
            showMobileActionButtonLoadingIndicator={isLoading}
            totalCars={totalCars}
            isSearchResults={hasFilters}
            isFilterModalOpen={isFilterModalOpen}
            toggleFilterModal={toggleFilterModalDecorator}
          />
        </CarSearchWidgetProvider>
      </LeftContent>
      <RightContent>
        {/* this saves us >800ms time on low budget devices, as when we click the filter on mobile,
        the whole component render is then busy with rendering of the products list, so we skip it from render */}
        {isMobile && !canDisplayRightColumn ? (
          <>
            {range(0, PRODUCT_SEARCH_RESULT_LIMIT - 1).map(i => (
              <TileProductCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <SearchProductListContainer<SharedTypes.Product>
            ProductListComponent={SearchProductListView}
            TileCardElement={TileProductCardGridElement}
            TileCardSkeletonElement={TileProductCardSkeleton}
            TileCardSSRSkeletonElement={TileProductSSRSkeletonGridElement}
            ListCardElement={ListProductRowElement}
            ListCardSkeletonElement={ListProductCardSkeleton}
            partialLoading={partialLoading}
            loading={noCarsToDisplay || isLoading}
            products={carProductsState.carProducts}
            totalProducts={totalCars}
            isCompact={hasFilters}
            currentPage={page}
            productListHeader={
              <ProductSearchListHeader
                loading={allProvidersLoading || someProviderLoading || noCarsToDisplay || isLoading}
                totalProducts={totalCars}
                hasFilters={selectedFilters.length > 0}
                onClearFilters={onClearFilters}
                header={carSearchT("{totalCars} cars match your search", {
                  totalCars,
                })}
              />
            }
            pageType={PageType.CAR}
            sortOptions={sortOptions}
            customSortParams={customSortParams}
            totalPages={totalPages}
            defaultLayout={PageLayout.LIST}
            imgixParams={carsListImgixParams}
          />
        )}
      </RightContent>
    </Row>
  );
};

export default CarSearchContainer;
