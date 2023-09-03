import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { constructSearchHotel } from "./utils/accommodationSearchUtils";
import AccommodationSearchAndCategoryContainer from "./AccommodationSearchAndCategoryContainer";
import PopularAccommodationQuery from "./queries/PopularAccommodationQuery.graphql";

const AccommodationLandingContainer = () => {
  const { error, data } =
    useQuery<AccommodationSearchTypes.QueryPopularHotels>(PopularAccommodationQuery);

  const topHotels = data?.topHotelsSearch?.hotels ?? [];
  const popularAccommodations = useMemo(
    () => topHotels.map(hotel => constructSearchHotel(hotel)),
    [topHotels]
  );

  if (error) return null;

  return (
    <AccommodationSearchAndCategoryContainer
      popularAccommodations={popularAccommodations}
      popularAccommodationsMetadata={data?.topHotelsSearch?.metadata}
    />
  );
};

export default AccommodationLandingContainer;
