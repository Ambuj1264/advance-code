import React, { useContext, useEffect, useMemo } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { searchWidgetAlignment } from "../VacationPackagesSearchWidget/VacationPackageSearchWidget";

import { useOnGTETourLocationInputChange } from "./utils/gteTourSearchHooks";
import { useGTETourSearchQuery } from "./useGTETourSearch";
import useGTETourDefaultLocations from "./useTourDefaultLocations";

import useTourSearchParams from "components/features/SearchPage/useTourSearchQueryParams";
import SearchPageStateContext from "components/features/SearchPage/SearchPageStateContext";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import SearchWidgetContainer from "components/features/SearchPage/Search/SearchWidgetContainer";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { ListProductRowElement } from "components/ui/Search/ListProductCard";
import { TileProductCardGridElement } from "components/ui/Search/TileProductCard";
import TileProductCardSkeleton, {
  TileProductSSRSkeletonGridElement,
} from "components/ui/Search/TileProductCardSkeleton";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import Row from "components/ui/Grid/Row";
import { PageType, GraphCMSPageType } from "types/enums";
import { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getTourSortOptions } from "components/ui/Sort/sortUtils";
import { ListHeaderColumnRight } from "components/ui/Search/SearchList";
import Container from "components/ui/Grid/Container";
import { getSearchBreadcrumbsConditions } from "components/ui/Search/utils/sharedSearchUtils";
import { InputStyled } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";

const SearchProductListContainerWrapper = styled.div`
  ${ListHeaderColumnRight} {
    align-self: flex-start;
  }
`;

const StyledSearchWidgetContainer = styled(SearchWidgetContainer)`
  ${InputStyled} {
    height: 40px;
  }
  ${searchWidgetAlignment};
`;

const GTETourSearchContentContainer = ({
  queryCondition,
  className,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  className?: string;
}) => {
  const theme: Theme = useTheme();
  const { t: tourT } = useTranslation(Namespaces.tourSearchNs);
  const { setContextState, startingLocationItems } = useContext(SearchPageStateContext);
  const [{ startingLocationId }] = useTourSearchParams();
  const {
    totalPages,
    totalTours,
    tourResults,
    isLoading,
    filters,
    onClearFilters,
    pageInfo,
    numberOfTravellers,
    selectedFilters,
  } = useGTETourSearchQuery();
  const sortOptions = getTourSortOptions(theme);
  const onLocationInputChange = useOnGTETourLocationInputChange();
  const defaultLocationsList = useGTETourDefaultLocations({
    shouldSkip: Boolean(startingLocationItems?.length),
  });
  const searchBreadcrumbsConditions = useMemo(
    () => getSearchBreadcrumbsConditions(GraphCMSPageType.Tours, startingLocationId),
    [startingLocationId]
  );

  useEffect(() => {
    if (defaultLocationsList.length > 0 && !startingLocationItems?.length) {
      setContextState({ startingLocationItems: defaultLocationsList });
    }
  }, [defaultLocationsList, startingLocationItems, setContextState]);

  const { t: tourSearch } = useTranslation(Namespaces.commonNs);

  return (
    <Container data-testid="tourSearchResultGTE">
      <LandingPageBreadcrumbs
        queryCondition={searchBreadcrumbsConditions || queryCondition}
        hideLastBreadcrumb={false}
      />
      <Row>
        <LeftContent>
          <LazyHydrateWrapper whenVisible key="gteTourSearchWidget">
            <StyledSearchWidgetContainer
              filters={filters}
              totalTours={totalTours}
              isLoading={isLoading}
              onLocationInputChange={onLocationInputChange}
              isMobileFooterShown
              selectedFilters={selectedFilters}
              className={className}
            />
          </LazyHydrateWrapper>
        </LeftContent>
        <RightContent>
          <SearchProductListContainerWrapper>
            <SearchProductListContainer<SharedTypes.Product>
              forceOpenInSameWindowIfNoLinkTarget
              TileCardElement={TileProductCardGridElement}
              TileCardSkeletonElement={TileProductCardSkeleton}
              TileCardSSRSkeletonElement={TileProductSSRSkeletonGridElement}
              ListCardElement={ListProductRowElement}
              ListCardSkeletonElement={ListProductCardSkeleton}
              loading={isLoading}
              products={tourResults}
              totalProducts={totalTours}
              isCompact
              hasNextPage={pageInfo?.hasNextPage}
              hasPreviousPage={pageInfo?.hasPreviousPage}
              nextPageCursor={pageInfo?.endCursor}
              prevPageCursor={pageInfo?.startCursor}
              currentPage={1}
              useCursorPagination
              skipPaginationMetaTags
              resetPageOnSortSelection
              priceSubtitle={
                numberOfTravellers
                  ? tourSearch("Price for {numberOfTravelers} travelers", {
                      numberOfTravelers: numberOfTravellers,
                    })
                  : undefined
              }
              productListHeader={
                <ProductSearchListHeader
                  loading={isLoading}
                  hasFilters={selectedFilters.length > 0}
                  totalProducts={totalTours}
                  onClearFilters={onClearFilters}
                  header={tourT("{numberOfTours} tours match your search", {
                    numberOfTours: totalTours,
                  })}
                />
              }
              pageType={PageType.GTE_TOUR}
              sortOptions={sortOptions}
              totalPages={totalPages}
            />
          </SearchProductListContainerWrapper>
        </RightContent>
      </Row>
    </Container>
  );
};

export default GTETourSearchContentContainer;
