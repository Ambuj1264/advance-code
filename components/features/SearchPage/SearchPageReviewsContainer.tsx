import React from "react";
import { useQuery } from "@apollo/react-hooks";

import ReviewsStructuredData from "components/features/SEO/ReviewsStructuredData";
import TourCategoryInformationQuery from "components/features/SearchPage/queries/TourCategoryInformationQuery.graphql";
import { constructReviews } from "components/features/Reviews/utils/reviewUtils";
import PaginatedReviews from "components/ui/PaginatedReviews";
import { groupBy } from "utils/globalUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const SearchPageReviewsContainer = ({ slug }: { slug: string }) => {
  const { data } = useQuery<{
    tourCategoryInformation?: { reviews?: QueryReview[] };
  }>(TourCategoryInformationQuery, {
    variables: { slug },
  });

  const queryReviews = data?.tourCategoryInformation?.reviews ?? [];

  if (!queryReviews.length) {
    return null;
  }

  const reviews = constructReviews(queryReviews);
  const groupedReviewsByTour = groupBy(queryReviews, "itemUrl");

  return (
    <LazyHydrateWrapper ssrOnly>
      {Object.keys(groupedReviewsByTour).map(key => (
        <ReviewsStructuredData
          key={key}
          reviews={groupedReviewsByTour[key]}
          productName={groupedReviewsByTour[key][0].itemName}
        />
      ))}
      <PaginatedReviews reviews={reviews} />
    </LazyHydrateWrapper>
  );
};

export default SearchPageReviewsContainer;
