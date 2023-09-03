import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";

import { constructReviews } from "../Reviews/utils/reviewUtils";

import carSearchReviewsPaginated from "./queries/CarSearchReviewsPaginatedQuery.graphql";
import CarSearchReviewsStructuredData from "./CarSearchReviewsStructuredData";
import CarReviewsPaginated from "./CarReviewsPaginated";

import { useSettings } from "contexts/SettingsContext";

const CarSearchReviewsContainer = ({ slug }: { slug: string }) => {
  const [page, setPage] = useState(1);
  const { imageHostingUrl } = useSettings();

  const pageChangeHandler = useCallback((current: number) => {
    setPage(current);
  }, []);

  const { data, loading } = useQuery<{
    reviews: QueryReviewPaginatedData;
  }>(carSearchReviewsPaginated, {
    variables: {
      slug,
      page,
    },
  });

  const reviewsData = data?.reviews;
  const totalPages = reviewsData?.meta?.pages || 0;
  const queryReviews = reviewsData?.reviews || [];
  const reviews = constructReviews(queryReviews, imageHostingUrl, true);

  return (
    <div>
      <CarSearchReviewsStructuredData reviews={reviews} />
      <CarReviewsPaginated
        loading={loading}
        reviews={reviews}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </div>
  );
};

export default CarSearchReviewsContainer;
