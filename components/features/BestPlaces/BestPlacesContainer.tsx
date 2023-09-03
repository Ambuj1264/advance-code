import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { useTheme } from "emotion-theming";

import BestPlacesSEO from "./BestPlacesSEO";
import { mockCoverImages } from "./utils/bestPlacesMockData";
import {
  constructBestPlacesFilters,
  constructBestPlaces,
  normalizeBestPlacesCoverData,
} from "./utils/bestPlacesUtils";
import BestPlacesStateContext, { useBestPlacesContext } from "./BestPlacesStateContext";
import BestPlacesSearchWidgetContainer from "./Search/BestPlacesSearchWidgetContainer";
import BestPlacesSearchCoverContainer from "./BestPlacesSearchCoverContainer";
import useBestPlacesQueryParams from "./useBestPlacesQueryParams";
import useAutocompletePlaces from "./hooks/useAutocompletePlaces";

import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { useSettings } from "contexts/SettingsContext";
import useTimeToLiveUUID from "hooks/useTimeToLiveUUID";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import { TilePlaceCardGridElement } from "components/ui/Search/TilePlaceCard";
import TilePlaceCardSkeleton, {
  TilePlaceSSRSkeletonGridElement,
} from "components/ui/Search/TilePlaceCardSkeleton";
import { ListPlaceRowElement } from "components/ui/Search/ListPlaceCard";
import ListPlaceCardSkeleton from "components/ui/Search/ListPlaceCardSkeleton";
import { LandingPageType, PageType } from "types/enums";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import Row from "components/ui/Grid/Row";
import Container, { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import { getBestPlacesSortOptions } from "components/ui/Sort/sortUtils";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { getStartingLocationItems } from "components/features/SearchPage/utils/searchUtils";
import {
  scrollSearchPageToTop,
  useSearchScrollToTopEvents,
} from "components/ui/Search/utils/sharedSearchUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import useMobileFooterState from "hooks/useMobileFooterState";
import AdvancedFilterContainer from "components/ui/AdvancedFilterMobileSteps/AdvancedFilterContainer";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { useRedirectToPageParam } from "hooks/useRedirect";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const BestPlacesContainer = ({
  locationPlaceholder,
  defaultFilters,
  bestPlaces = [],
  bestPlacesMetadata,
  bestPlacesLoading = false,
  pageHeaderData,
  mapData,
}: {
  locationPlaceholder: string;
  defaultFilters?: BestPlacesTypes.Filters;
  bestPlaces?: BestPlacesTypes.QueryBestPlace[];
  bestPlacesMetadata?: BestPlacesTypes.BestPlacesMetadata;
  bestPlacesLoading?: boolean;
  pageHeaderData?: BestPlacesTypes.QueryBestPlacesPageHeader;
  mapData: SharedTypes.Map;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const theme: Theme = useTheme();
  const [
    {
      orderBy,
      page,
      activeTab,
      startingLocationId: selectedLocationId,
      startingLocationName: selectedLocationName,
      attractionIds: attractionTypeIds,
      destinationId,
    },
    setQueryParams,
  ] = useBestPlacesQueryParams();
  const { setContextState } = useBestPlacesContext();

  const coverData = normalizeBestPlacesCoverData(pageHeaderData);
  const filters = constructBestPlacesFilters(defaultFilters);
  const hasFilters = Boolean(
    orderBy || destinationId || attractionTypeIds || selectedLocationId || selectedLocationName
  );
  const shouldShowCover = !hasFilters;
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  const hasPageFilter = page > 1;
  const sortOptions = getBestPlacesSortOptions(theme);
  const { isMobileFooterShown } = useMobileFooterState(hasFilters || hasPageFilter || undefined);

  const places = constructBestPlaces(bestPlaces);

  const onClearFilters = useCallback(() => {
    setQueryParams({}, QueryParamTypes.PUSH);
  }, [setQueryParams]);

  const UUID = useTimeToLiveUUID({ timeToLiveInMs: 60000 });
  const { countryCode } = useSettings();

  const setStartingLocationContext = useCallback(
    (
      autoCompletePlaces: SharedTypes.AutocompleteItem[],
      defaultSelectedLocation?: SharedTypes.AutocompleteItem
    ) => {
      const contextState = getStartingLocationItems({
        startingLocationsResult: autoCompletePlaces,
        defaultSelectedLocation,
      });

      setContextState(contextState);
    },
    [setContextState]
  );

  const fetchAutocompletePlaces = useAutocompletePlaces(setStartingLocationContext);

  const onLocationInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      fetchAutocompletePlaces({
        variables: {
          countryCode,
          searchValue: e.target.value,
          sessionToken: UUID,
        },
      });
    },
    [UUID, countryCode, fetchAutocompletePlaces]
  );

  const handleShowLessClick = useCallback(() => {
    const leftContentHeight = leftContentRef?.current?.offsetHeight;
    const rightContentHeight = rightContentRef?.current?.offsetHeight;

    if (leftContentHeight && rightContentHeight && leftContentHeight > rightContentHeight) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [leftContentRef, rightContentRef]);

  // eslint-disable-next-line prefer-destructuring
  const totalResults = bestPlacesMetadata?.totalResults;

  const queryParamFilters = {
    destinationId,
    attractionTypeIds,
  };
  const { onTotalProductsChange, onLoadingStateChange, onTotalFiltersChange, onPageChange } =
    useSearchScrollToTopEvents({
      totalProducts: totalResults,
      loadingState: bestPlacesLoading,
      queryParamFilters,
      page,
    });

  useEffect(() => {
    const scrollOnStartLoading = onLoadingStateChange && bestPlacesLoading;
    const shouldSmoothScroll =
      (hasFilters && (scrollOnStartLoading || onTotalFiltersChange || onTotalProductsChange)) ||
      onPageChange;

    if (shouldSmoothScroll) {
      scrollSearchPageToTop();
    }
  }, [
    bestPlacesLoading,
    hasFilters,
    onLoadingStateChange,
    onPageChange,
    onTotalFiltersChange,
    onTotalProductsChange,
    page,
    shouldShowCover,
  ]);

  const totalPages = bestPlacesMetadata?.pages;

  useRedirectToPageParam({
    page,
    loading: bestPlacesLoading,
    totalPages,
    goToPage: 1,
  });

  return (
    <>
      <BestPlacesSEO places={places} page={page} />
      <Container>
        <BreadcrumbsContainer
          type={PageType.ATTRACTION}
          landingPageType={LandingPageType.ATTRACTIONS}
        />
        <Row>
          <LeftContent ref={leftContentRef}>
            <LazyHydrateWrapper whenVisible key="searchWidget">
              <BestPlacesSearchWidgetContainer
                locationPlaceholder={locationPlaceholder}
                onLocationInputChange={onLocationInputChange}
                activeTab={activeTab}
                filters={filters}
                totalPlaces={totalResults}
                isLoading={bestPlacesLoading}
                isMobileFooterShown={isMobileFooterShown}
                onShowLessFiltersClick={handleShowLessClick}
              />
            </LazyHydrateWrapper>
          </LeftContent>
          <RightContent>
            <div ref={rightContentRef}>
              <BestPlacesSearchCoverContainer
                cover={coverData}
                mapData={mapData}
                mapImages={mockCoverImages}
                isMobileFooterShown={isMobileFooterShown}
                shouldShowCover={shouldShowCover}
                locationPlaceholder={locationPlaceholder}
              >
                <AdvancedFilterContainer
                  locationPlaceholder={locationPlaceholder}
                  context={BestPlacesStateContext}
                />
              </BestPlacesSearchCoverContainer>

              <SearchProductListContainer<SharedTypes.PlaceProduct>
                TileCardElement={TilePlaceCardGridElement}
                TileCardSkeletonElement={TilePlaceCardSkeleton}
                TileCardSSRSkeletonElement={TilePlaceSSRSkeletonGridElement}
                ListCardElement={ListPlaceRowElement}
                ListCardSkeletonElement={ListPlaceCardSkeleton}
                loading={bestPlacesLoading}
                products={places}
                totalProducts={totalResults}
                currentPage={page}
                productListHeader={
                  <ProductSearchListHeader
                    loading={bestPlacesLoading}
                    hasFilters={hasFilters}
                    totalProducts={totalResults}
                    onClearFilters={onClearFilters}
                    header={commonSearchT("{numberOfProducts} results match your search", {
                      numberOfProducts: totalResults,
                    })}
                  />
                }
                pageType={PageType.ATTRACTION}
                sortOptions={sortOptions}
                totalPages={totalPages}
                isCompact={false}
              />
            </div>
          </RightContent>
        </Row>
      </Container>
      <AdminGearLoader />
    </>
  );
};

export default BestPlacesContainer;
