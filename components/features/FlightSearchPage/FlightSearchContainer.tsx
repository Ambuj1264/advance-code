import React, { useMemo } from "react";
import { useTheme } from "emotion-theming";

import FlightSearchWidget from "./FlightSearchWidget/FlightSearchWidget";
import FlightSearchPageProvider from "./FlightSearchPageProvider";
import useFlightSearch from "./useFlightSearch";
import { flightSortParameters } from "./utils/flightSearchUtils";

import CustomNextDynamic from "lib/CustomNextDynamic";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { defaultSEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import FlightCardSkeleton from "components/ui/FlightsShared/FlightCardSkeleton";
import FlightCardSearchResultWrapper from "components/ui/FlightsShared/FlightCardSearchResultWrapper";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { getFlightsSortOptions } from "components/ui/Sort/sortUtils";
import Row from "components/ui/Grid/Row";
import { GraphCMSPageType, PageLayout, PageType } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useRedirectToPageParam } from "hooks/useRedirect";

const SearchProductListView = CustomNextDynamic(
  () => import("components/ui/Search/SearchProductListView"),
  {
    loading: () => null,
    ssr: true,
  }
);

const FlightSearchContainer = ({
  flightQueryCondition,
}: {
  flightQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const theme: Theme = useTheme();
  const isMobile = useIsMobile();

  const { t } = useTranslation(Namespaces.flightSearchNs);

  const {
    isLoading,
    filters,
    hasNoFilters,
    totalPages,
    hasSearchFilters,
    flightResults,
    onClearFilters,
    totalResults,
    updateSearchId,
    page,
    noAvailableStopover,
  } = useFlightSearch();

  useRedirectToPageParam({ loading: isLoading, page, totalPages, goToPage: 1 });

  const sortParameters = useMemo(flightSortParameters, []);
  return (
    <FlightSearchPageProvider updateSearchId={updateSearchId}>
      <LandingPageSEOContainer
        isIndexed={false}
        queryCondition={flightQueryCondition}
        ogImages={[defaultSEOImage]}
        funnelType={GraphCMSPageType.Flights}
      />
      <Row>
        <LeftContent>
          <FlightSearchWidget
            hasFilters={hasSearchFilters}
            loading={isLoading}
            totalResults={totalResults}
            areFiltersLoading={isLoading && hasNoFilters}
            isMobile={isMobile}
            noAvailableStopover={noAvailableStopover}
            {...filters}
          />
        </LeftContent>
        <RightContent>
          <SearchProductListContainer<FlightSearchTypes.FlightItinerary>
            ProductListComponent={SearchProductListView}
            ListCardElement={FlightCardSearchResultWrapper}
            ListCardSkeletonElement={FlightCardSkeleton}
            loading={isLoading}
            products={flightResults}
            totalProducts={totalResults}
            isCompact
            currentPage={page}
            defaultLayout={PageLayout.LIST}
            productListHeader={
              <ProductSearchListHeader
                loading={isLoading}
                totalProducts={totalResults}
                hasFilters={!hasNoFilters}
                onClearFilters={onClearFilters}
                header={t("{numberOfFlights} flights match your search", {
                  numberOfFlights: totalResults ?? 0,
                })}
              />
            }
            pageType={PageType.FLIGHT}
            sortOptions={getFlightsSortOptions(theme)}
            totalPages={totalPages}
            customSortParams={sortParameters}
          />
        </RightContent>
      </Row>
      <AdminGearLoader hideCommonLinks />
    </FlightSearchPageProvider>
  );
};

export default FlightSearchContainer;
