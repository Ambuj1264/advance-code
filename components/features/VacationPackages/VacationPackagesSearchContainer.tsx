import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { constructStateFromQueryParams } from "../VacationPackagesSearchWidget/utils/constructStateFromQueryParams";
import ProductCarouselSchema from "../SEO/ProductCarouselSchema";
import { constructSEOProduct } from "../SEO/utils/SEOUtils";
import AdminGearLoader from "../AdminGear/AdminGearLoader";
import { decodeOccupanciesArray } from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

import useVacationSearchQueryParams, {
  encodeVPSearchQueryParams,
} from "./utils/useVacationSearchQueryParams";
import VacationPackagesSearchQuery from "./queries/VacationPackagesSearchQuery.graphql";
import {
  constructVacationPackageProduct,
  constructVPSearchQueryVariables,
} from "./utils/vacationPackagesUtils";
import {
  addAllDaysToDayFilters,
  constructFiltersWithDaysDisabled,
  constructVacationSearchFilters,
  getVPSelectedFilters,
  VacationPackageVpType,
} from "./utils/vacationSearchFilterUtils";
import VPSearchMobileFooter from "./VPSearchMobileFooter";
import VPSearchWidgetAndFiltersDesktop from "./VPSearchWidgetAndFiltersDesktop";
import VPLandingPageQuery from "./queries/VPLandingPageQuery.graphql";

import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import useOnDidUpdate from "hooks/useOnDidUpdate";
import { useSwrQuery } from "hooks/useSwrQuery";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import Container, { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import Row from "components/ui/Grid/Row";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import { TileProductCardGridElement } from "components/ui/Search/TileProductCard";
import TileProductCardSkeleton, {
  TileProductSSRSkeletonGridElement,
} from "components/ui/Search/TileProductCardSkeleton";
import { ListProductRowElement } from "components/ui/Search/ListProductCard";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import { PageType, GraphCMSPageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { getTotalPages, getUUID, normalizeGraphCMSLocale } from "utils/helperUtils";
import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import {
  constructLandingPageContent,
  defaultVacationPackagesSearchSEOImage,
  getAdminLinks,
} from "components/ui/LandingPages/utils/landingPageUtils";
import { getVPSearchSortOptions, VPSearchSortParams } from "components/ui/Sort/sortUtils";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import lazyCaptureException from "lib/lazyCaptureException";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { cacheOnClient30M } from "utils/apiUtils";
import { getSearchBreadcrumbsConditions } from "components/ui/Search/utils/sharedSearchUtils";
import { getTotalNumberOfGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { QuickFact } from "components/ui/Information/ProductSpecs";

const VPListProductRowElement = styled(ListProductRowElement)`
  ${QuickFact}:nth-child(-n + 2) {
    margin-top: 0;
  }
`;

const VacationPackagesSearchContainer = ({
  categorySlug,
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  categorySlug?: string;
}) => {
  const theme: Theme = useTheme();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const { t } = useTranslation(Namespaces.vacationPackagesSearchN);
  const [queryParams, setQueryParams] = useVacationSearchQueryParams();
  const locale = useActiveLocale();
  const { countryCode } = useSettings();

  const vpSearchWidgetInitialState = constructStateFromQueryParams(queryParams);

  const sortOptions = useMemo(() => getVPSearchSortOptions(theme), [theme]);
  const sortParams = VPSearchSortParams;
  const [requestId, setRequestId] = useState(queryParams.requestId || getUUID());

  const {
    destinationId,
    destinationName,
    originId,
    originName,
    dateFrom,
    dateTo,
    includeFlights,
    occupancies,
    numberOfDays,
    activityIds,
    destinationIds,
    countryIds,
    types,
    price,
    page = 1,
    orderBy,
    orderDirection,
  } = queryParams;
  const decodedOccupancies = decodeOccupanciesArray(occupancies);
  const numberOfTravellers = getTotalNumberOfGuests(decodedOccupancies);
  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        destinationId,
        destinationName,
        originId,
        originName,
        dateFrom,
        dateTo,
        occupancies,
        includeFlights,
      },
      QueryParamTypes.PUSH
    );
  }, [
    setQueryParams,
    destinationId,
    destinationName,
    originId,
    originName,
    dateFrom,
    dateTo,
    occupancies,
    includeFlights,
  ]);

  useOnDidUpdate(() => {
    setRequestId(getUUID());
    // we have to update requestId when one of the major dependencies are changed:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId, originId, dateFrom, dateTo, occupancies]);

  useEffect(() => {
    setQueryParams({ requestId }, QueryParamTypes.PUSH_IN);
  }, [requestId, setQueryParams]);

  const { data: contentData } =
    useQuery<QueryVacationPackagesSearchTypes.VPLandingPageContentQuery>(VPLandingPageQuery, {
      variables: {
        where: queryCondition,
        locale: normalizeGraphCMSLocale(locale),
      },
    });
  const landingPageContent =
    contentData?.landingPages &&
    constructLandingPageContent(contentData?.landingPages, countryCode);

  // TODO: this is a fix for multiple search request, improve in future
  const vpSearchQueryVariables = useMemo(
    () =>
      constructVPSearchQueryVariables({
        queryParams,
        requestId,
        type: landingPageContent?.subType as VacationPackageVpType,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      numberOfDays,
      activityIds,
      destinationIds,
      countryIds,
      types,
      price,
      page,
      orderBy,
      orderDirection,
      includeFlights,
      requestId,
    ]
  );

  const { data, loading, error } =
    useSwrQuery<QueryVacationPackagesSearchTypes.VacationPackagesSearch>(
      VacationPackagesSearchQuery,
      {
        variables: vpSearchQueryVariables,
        fetchPolicy: "cache-and-network",
        context: {
          headers: cacheOnClient30M,
        },
        skip: !landingPageContent,
      }
    );
  const vpSearchLoading = !landingPageContent || loading;

  const vacationPackagesProducts =
    data?.vacationPackages?.nodes?.map(vacationPackage =>
      constructVacationPackageProduct({
        vacationPackageT: vacationT,
        vacationProduct: vacationPackage,
        slug: categorySlug,
        encodedQueryParamsString: encodeVPSearchQueryParams(queryParams),
      })
    ) ?? [];

  const totalVacationPackages = data?.vacationPackages?.totalCount || 0;

  let activeFilters: FilterSectionListType = useMemo(() => [], []);
  if (data?.vacationPackages?.filters) {
    const filters = constructVacationSearchFilters(data?.vacationPackages.filters, t);

    const withDaysDisabled = constructFiltersWithDaysDisabled(
      filters,
      data?.vacationPackages.filters?.numberOfDays
    );

    activeFilters = addAllDaysToDayFilters(withDaysDisabled, t);
  }
  const selectedFilters = useMemo(
    () =>
      getVPSelectedFilters({
        numberOfDays,
        activityIds,
        destinationIds,
        countryIds,
        types,
        price,
        filters: activeFilters,
        currencyCode,
        convertCurrency,
      }),
    [
      numberOfDays,
      activityIds,
      destinationIds,
      countryIds,
      types,
      price,
      activeFilters,
      currencyCode,
      convertCurrency,
    ]
  );
  const searchBreadcrumbsConditions = useMemo(
    () => getSearchBreadcrumbsConditions(GraphCMSPageType.VacationPackages, destinationId),
    [destinationId]
  );
  useEffect(() => {
    if (error && !data?.vacationPackages?.nodes?.length) {
      lazyCaptureException(new Error(`Query 'VacationPackagesSearch' return empty results`), {
        errorInfo: error,
        componentName: "VacationPackagesSearchContainer",
      });
    }
  }, [error, data]);
  return (
    <>
      <LandingPageSEOContainer
        queryCondition={queryCondition}
        ogImages={
          landingPageContent?.image
            ? [landingPageContent?.image]
            : [defaultVacationPackagesSearchSEOImage]
        }
        isIndexed={false}
        funnelType={GraphCMSPageType.VacationPackages}
      />
      {vacationPackagesProducts.length > 0 ? (
        <LazyHydrateWrapper ssrOnly>
          <ProductCarouselSchema products={constructSEOProduct(vacationPackagesProducts)} />
        </LazyHydrateWrapper>
      ) : null}

      <Container data-testid="vacationPackagesSearchResultGTE">
        <LandingPageBreadcrumbs
          queryCondition={searchBreadcrumbsConditions || queryCondition}
          customLastBreadcrumb={landingPageContent?.title}
        />
        <Row>
          <LeftContent>
            <VPSearchWidgetAndFiltersDesktop
              vpSearchWidgetInitialState={vpSearchWidgetInitialState}
              activeFilters={activeFilters}
              selectedFilters={selectedFilters}
            />
            <VPSearchMobileFooter
              queryParams={queryParams}
              activeFilters={activeFilters}
              loading={vpSearchLoading}
              totalVacationPackages={totalVacationPackages}
              selectedFilters={selectedFilters}
            />
          </LeftContent>
          <RightContent>
            <SearchProductListContainer<SharedTypes.Product>
              skipPaginationMetaTags
              resetPageOnSortSelection
              partialLoading={{
                someProviderLoading: vpSearchLoading,
                allProvidersLoading: false,
              }}
              forceOpenInSameWindowIfNoLinkTarget
              TileCardElement={TileProductCardGridElement}
              TileCardSkeletonElement={TileProductCardSkeleton}
              TileCardSSRSkeletonElement={TileProductSSRSkeletonGridElement}
              ListCardElement={VPListProductRowElement}
              ListCardSkeletonElement={ListProductCardSkeleton}
              loading={vpSearchLoading}
              products={vacationPackagesProducts}
              totalProducts={totalVacationPackages}
              totalPages={getTotalPages(totalVacationPackages, 24)}
              currentPage={page}
              isCompact
              priceSubtitle={
                numberOfTravellers
                  ? vacationT("Price for {numberOfTravelers} travelers", {
                      numberOfTravelers: numberOfTravellers,
                    })
                  : undefined
              }
              productListHeader={
                <ProductSearchListHeader
                  loading={vpSearchLoading}
                  hasFilters={selectedFilters.length > 0}
                  totalProducts={totalVacationPackages}
                  onClearFilters={onClearFilters}
                  header={t("{numberOfPackages} vacation packages match your search", {
                    numberOfPackages: totalVacationPackages,
                  })}
                />
              }
              pageType={PageType.VACATION_PACKAGE}
              sortOptions={sortOptions}
              customSortParams={sortParams}
              isVPResults
            />
          </RightContent>
        </Row>
        <AdminGearLoader hideCommonLinks links={getAdminLinks(landingPageContent?.id)} />
      </Container>
    </>
  );
};

export default VacationPackagesSearchContainer;
