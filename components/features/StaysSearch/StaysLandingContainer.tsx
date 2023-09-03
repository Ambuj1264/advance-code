import React from "react";

import useAccommodationSearchQueryParams from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import { doesAccommodationSearchHaveFilters } from "../AccommodationSearchPage/utils/accommodationSearchUtils";

import StaysSearchContainer from "./StaysSearchContainer";
import StayLandingPageContentContainer from "./StayLandingPageContentContainer";

const StaysLandingContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const [queryParams] = useAccommodationSearchQueryParams();
  const hasFilters = doesAccommodationSearchHaveFilters(queryParams);
  return hasFilters ? (
    <StaysSearchContainer queryCondition={queryCondition} />
  ) : (
    <StayLandingPageContentContainer queryCondition={queryCondition} />
  );
};

export default StaysLandingContainer;
