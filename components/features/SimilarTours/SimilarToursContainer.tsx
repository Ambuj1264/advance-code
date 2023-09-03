import React from "react";
import { useQuery } from "@apollo/react-hooks";

import similarToursQuery from "./queries/SimilarToursQuery.graphql";
import constructSimilarTours, { constructSimilarToursSearchQuery } from "./utils/similarToursUtils";

import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import SimilarProducts from "components/ui/SimilarProducts/SimilarProducts";
import { PageType } from "types/enums";

type Props = {
  slug: string;
  dateFrom?: string;
  dateTo?: string;
  childrenAges?: number[];
  adults?: number;
  startingLocationId?: string;
  startingLocationName?: string;
};

const SimilarToursContainer = ({
  slug,
  dateFrom,
  dateTo,
  childrenAges,
  adults,
  startingLocationId,
  startingLocationName,
}: Props) => {
  const { error, data, loading } = useQuery<QuerySimilarToursData>(similarToursQuery, {
    variables: {
      slug,
      ...(dateFrom ? { dateFrom } : null),
    },
  });
  if (error) return null;
  if (loading || !data || !data.similarTours) {
    return <SimilarProductsLoading />;
  }

  const queryString = constructSimilarToursSearchQuery(
    adults!,
    childrenAges!,
    startingLocationName!,
    startingLocationId,
    dateFrom,
    dateTo
  );

  const similarTours = constructSimilarTours(data.similarTours.tours);
  const { seeMoreLink } = data.similarTours;
  return (
    <SimilarProducts
      similarProducts={similarTours}
      seeMoreLink={queryString ? `${seeMoreLink}?${queryString}` : seeMoreLink}
      searchPageType={PageType.TOURSEARCH}
    />
  );
};

export default SimilarToursContainer;
