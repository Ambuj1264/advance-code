import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useQueryParams, NumberParam, StringParam } from "use-query-params";

import { constructSearchHotels } from "./utils/accommodationSearchUtils";
import AccommodationCategoryDefaultQuery from "./queries/AccommodationCategoryDefaultQuery.graphql";
import AccommodationSearchAndCategoryContainer from "./AccommodationSearchAndCategoryContainer";

import { AccommodationFilterQueryParam } from "types/enums";

const AccommodationCategoryContainer = ({
  slug,
  isHotelCategoryPage = false,
}: {
  slug: string;
  isHotelCategoryPage: boolean;
}) => {
  const [
    { page = 1, orderBy = isHotelCategoryPage ? "top_reviews" : "rating", orderDirection = "desc" },
  ] = useQueryParams({
    [AccommodationFilterQueryParam.PAGE]: NumberParam,
    [AccommodationFilterQueryParam.ORDER_BY]: StringParam,
    [AccommodationFilterQueryParam.ORDER_DIRECTION]: StringParam,
  });

  const { data: defaultData, loading: defaultDataLoading } =
    useQuery<AccommodationSearchTypes.QuerySearchAccommodations>(
      AccommodationCategoryDefaultQuery,
      {
        variables: {
          page,
          slug,
          orderBy,
          orderDirection,
          limit: 8,
        },
      }
    );

  const accommodationsData = defaultData?.accommodationSearch?.accommodations ?? [];
  const defaultAccommodations = useMemo(
    () => constructSearchHotels(accommodationsData),
    [accommodationsData]
  );

  return (
    <AccommodationSearchAndCategoryContainer
      slug={slug}
      isAccommodationCategory
      defaultDataLoading={defaultDataLoading}
      defaultTotalAccommodation={defaultData?.accommodationSearch?.totalAccommodations}
      defaultAccommodations={defaultAccommodations}
      isHotelCategoryPage={isHotelCategoryPage}
    />
  );
};

export default AccommodationCategoryContainer;
