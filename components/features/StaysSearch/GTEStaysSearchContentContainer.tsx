import React, { useContext, useEffect, useMemo } from "react";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import AccommodationSearchWidgetContainer from "../AccommodationSearchPage/AccommodationSearchWidgetContainer";
import AccommodationSearchContainer from "../AccommodationSearchPage/AccommodationSearchContainer";
import {
  AccommodationSearchPageCallbackContext,
  AccommodationSearchPageStateContext,
} from "../AccommodationSearchPage/AccommodationSearchPageStateContext";

import useStayDefaultLocations from "./useStayDefaultLocations";
import { staySortParameters } from "./utils/staysSearchPageUtils";
import { useStaysSearchQueryGTE } from "./useStaysSearchGTE";

import {
  getSearchBreadcrumbsConditions,
  scrollSearchPageToTop,
} from "components/ui/Search/utils/sharedSearchUtils";
import { GraphCMSPageType } from "types/enums";
import useAccommodationSearchQueryParams from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import { container, column } from "styles/base";
import { gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getSortOptions } from "components/ui/Sort/sortUtils";
import useOnDidUpdate from "hooks/useOnDidUpdate";

export const LeftContent = styled.div(column({ small: 1, large: 3 / 12 }));
export const RightContent = styled.div(column({ small: 1, medium: 1, large: 9 / 12 }));

export const Container = styled.div([
  container,
  css`
    display: flex;
    flex-direction: column;
    margin-bottom: ${gutters.small / 2}px;
  `,
]);

const GTEStaysSearchContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const [{ id, type }] = useAccommodationSearchQueryParams();

  const sortOptions = useMemo(() => getSortOptions(theme), [theme]);
  const { location, locationItems } = useContext(AccommodationSearchPageStateContext);
  const { setDefaultLocation } = useContext(AccommodationSearchPageCallbackContext);
  const defaultLocationsList = useStayDefaultLocations({
    accommodationAddress: location?.name,
    shouldSkip: locationItems !== undefined,
  });

  useEffect(() => {
    if (!defaultLocationsList || locationItems) return;
    setDefaultLocation(defaultLocationsList, location);
  }, [defaultLocationsList, location, locationItems, setDefaultLocation]);

  const {
    onClearFilters,
    filters,
    totalPages,
    totalAccommodations,
    mapData,
    mapDataLoading,
    products,
    isLoading,
    currentPage,
    selectedFilters,
    currencyCode,
    isCurrencyBeingChanged,
    hasNextPage,
    hasPreviousPage,
    fetchMapData,
  } = useStaysSearchQueryGTE();
  const searchBreadcrumbsConditions = useMemo(
    () => getSearchBreadcrumbsConditions(GraphCMSPageType.Stays, id, type),
    [id, type]
  );

  useOnDidUpdate(() => {
    scrollSearchPageToTop();
  }, [currentPage]);

  // TODO: revert to regular filters when google reviews are fixed
  const curatedFilters = filters.filter(f => f.sectionId !== "review_score");

  return (
    <Container data-testid="AccommodationSearchResultGTE">
      <LandingPageBreadcrumbs
        queryCondition={searchBreadcrumbsConditions || queryCondition}
        customLastBreadcrumb={t("Search results")}
      />
      <Row>
        <LeftContent>
          <AccommodationSearchWidgetContainer
            isMobileFooterShown
            showFilters
            filters={curatedFilters}
            totalAccommodations={totalAccommodations}
            isLoading={isLoading}
            defaultFilters={[]}
            selectedFilters={selectedFilters}
            withCurrencyConversion
          />
        </LeftContent>
        <RightContent>
          <AccommodationSearchContainer
            partialLoading={{
              allProvidersLoading: !isCurrencyBeingChanged && isLoading,
              someProviderLoading: isCurrencyBeingChanged,
            }}
            paginationLoading={!isCurrencyBeingChanged && isLoading}
            accommodationResult={products}
            totalAccommodations={totalAccommodations}
            shouldShowCover={false}
            totalPages={totalPages}
            currentPage={currentPage}
            isAccommodationCategory={false}
            sortOptions={sortOptions}
            customSortParams={staySortParameters}
            hasFilters={selectedFilters.length > 0}
            onClearFilters={onClearFilters}
            map={mapData}
            currencyCode={currencyCode}
            onMapOpen={fetchMapData}
            isMapLoading={mapDataLoading}
            useCursorPagination
            prevPageCursor={`${currentPage - 1}`}
            nextPageCursor={`${currentPage + 1}`}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </RightContent>
      </Row>
    </Container>
  );
};

export default GTEStaysSearchContentContainer;
