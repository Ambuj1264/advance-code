import React from "react";

import GTETourSearchContentProviderWrapper from "./GTETourSearchContentProviderWrapper";
import TourLandingPageContentContainer from "./GTETourLandingPageContentContainer";

import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { getAdjustedDatesInLocalStorage } from "utils/localStorageUtils";
import useTourSearchParams from "components/features/SearchPage/useTourSearchQueryParams";

const GTETourLandingContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const [
    {
      orderBy,
      orderDirection,
      durationIds,
      activityIds,
      attractionIds,
      startingLocationId,
      adults,
      children,
      childrenAges = [],
      dateFrom,
      dateTo,
      startingLocationName,
      page,
      time,
    },
  ] = useTourSearchParams();
  const queryDates = constructQueryFromSelectedDates(getAdjustedDatesInLocalStorage());

  const hasFilters = Boolean(
    orderBy ||
      orderDirection ||
      durationIds ||
      activityIds ||
      attractionIds ||
      startingLocationId ||
      time ||
      startingLocationName ||
      (adults && adults > 0) ||
      children !== undefined ||
      dateFrom ||
      dateTo ||
      page > 1
  );
  return hasFilters ? (
    <GTETourSearchContentProviderWrapper
      selectedLocationName={startingLocationName}
      selectedLocationId={startingLocationId}
      queryDates={queryDates}
      dateFrom={dateFrom}
      dateTo={dateTo}
      numberOfGuests={{ adults: adults || 1, children: childrenAges }}
      queryCondition={queryCondition}
    />
  ) : (
    <TourLandingPageContentContainer queryCondition={queryCondition} />
  );
};

export default GTETourLandingContainer;
