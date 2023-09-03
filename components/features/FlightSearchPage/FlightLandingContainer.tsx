import React, { useMemo } from "react";

import useFlightSearchQueryParams, {
  FlightSearchQueryParamsType,
} from "./utils/useFlightSearchQueryParams";
import FlightSearchContainer from "./FlightSearchContainer";
import FlightLandingPageContentContainer from "./FlightLandingPageContentContainer";
import { doesFlightSearchHaveFilters, getFlightPageType } from "./utils/flightSearchUtils";

import { useSettings } from "contexts/SettingsContext";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import Container from "components/ui/Search/SearchGrid";
import { getSearchBreadcrumbsConditions } from "components/ui/Search/utils/sharedSearchUtils";

const FlightLandingContainer = ({
  flightQueryCondition,
}: {
  flightQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const { marketplaceUrl } = useSettings();
  const [queryParams] = useFlightSearchQueryParams();
  const { destinationId } = queryParams;
  const hasSearchFilters = doesFlightSearchHaveFilters(queryParams as FlightSearchQueryParamsType);
  const pageType = getFlightPageType(marketplaceUrl);
  const searchBreadcrumbsConditions = useMemo(
    () => getSearchBreadcrumbsConditions(pageType, destinationId),
    [destinationId]
  );
  return hasSearchFilters ? (
    <Container data-testid="flightSearchResult">
      <LandingPageBreadcrumbs
        queryCondition={searchBreadcrumbsConditions || flightQueryCondition}
        customLastBreadcrumb="Search results"
      />
      <FlightSearchContainer flightQueryCondition={flightQueryCondition} />
    </Container>
  ) : (
    <FlightLandingPageContentContainer queryCondition={flightQueryCondition} />
  );
};

export default FlightLandingContainer;
