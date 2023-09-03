import React from "react";

import GTETourSearchContentContainer from "./GTETourSearchContentContainer";

import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import { defaultTourSEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { SearchPageStateContextProvider } from "components/features/SearchPage/SearchPageStateContext";
import { GraphCMSPageType } from "types/enums";

const GTETourSearchContentProviderWrapper = ({
  defaultLocationName,
  queryDates,
  selectedLocationId,
  selectedLocationName,
  dateTo,
  dateFrom,
  numberOfGuests,
  queryCondition,
}: {
  defaultLocationName?: string;
  queryDates?: SharedTypes.SelectedDatesQuery;
  selectedLocationId?: string;
  selectedLocationName?: string;
  dateFrom?: string;
  dateTo?: string;
  numberOfGuests: SharedTypes.NumberOfGuests;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  return (
    <SearchPageStateContextProvider
      selectedLocationId={selectedLocationId}
      selectedLocationName={selectedLocationName}
      locationPlaceholder={defaultLocationName}
      filterDateTo={dateTo || queryDates?.dateTo}
      filterDateFrom={dateFrom || queryDates?.dateFrom}
      adultsFilter={numberOfGuests.adults}
      childrenAges={numberOfGuests.children}
    >
      <LandingPageSEOContainer
        isIndexed={false}
        queryCondition={queryCondition}
        ogImages={[defaultTourSEOImage]}
        funnelType={GraphCMSPageType.Tours}
      />
      <GTETourSearchContentContainer queryCondition={queryCondition} />
    </SearchPageStateContextProvider>
  );
};

export default GTETourSearchContentProviderWrapper;
