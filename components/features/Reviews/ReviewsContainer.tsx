import React, { useState, useCallback, useContext, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import reviewsQuery from "./queries/ReviewsQuery.graphql";
import {
  constructLocaleOptions,
  getReviewsView,
  constructUpdatedUniqueReviews,
} from "./utils/reviewUtils";
import ReviewsLoading from "./ReviewsLoading";
import ErrorReviews from "./ErrorReviews";
import CommonReviewsContainer from "./CommonReviewsContainer";

import LocaleContext from "contexts/LocaleContext";

const REVIEWS_LIMIT = 10;

type State = {
  currentPage: number;
  localeFilter: string;
  scoreFilter: string;
  reviews: Review[];
  showSeeMoreReviewsButton: boolean;
  showEmptyReviewsMessage: boolean;
};

const ReviewsContainer = ({
  slug,
  id,
  type,
  reviewTotalScore,
  reviewTotalCount,
  reviewsLogo,
}: {
  slug?: string;
  id?: number;
  type: string;
  reviewTotalScore: number;
  reviewTotalCount: number;
  reviewsLogo?: Image;
}) => {
  const activeLocale = useContext(LocaleContext);
  const initialState = useMemo(
    () => ({
      reviews: [],
      currentPage: 1,
      localeFilter: activeLocale,
      scoreFilter: "",
      showSeeMoreReviewsButton: false,
      showEmptyReviewsMessage: false,
    }),
    [activeLocale]
  );
  const [state, setState] = useState<State>(initialState);

  const { error, data, loading } = useQuery<QueryReviewData>(reviewsQuery, {
    variables: {
      slug,
      id,
      type,
      page: state.currentPage,
      localeFilter: state.localeFilter,
      scoreFilter: state.scoreFilter ? parseInt(state.scoreFilter, 10) : null,
    },
  });

  const getMoreReviews = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentPage: prevState.currentPage + 1,
    }));
  }, []);

  const changeLocaleFilter = useCallback(
    (localeFilter: string) => {
      setState(prevState => ({
        ...initialState,
        localeFilter,
        scoreFilter: prevState.scoreFilter,
      }));
    },
    [initialState]
  );

  const changeScoreFilter = useCallback(
    (scoreFilter: string) => {
      setState(prevState => ({
        ...initialState,
        scoreFilter,
        localeFilter: prevState.localeFilter,
      }));
    },
    [initialState]
  );

  const clearFilters = useCallback(() => {
    setState({ ...initialState, localeFilter: "" });
  }, [initialState]);

  useEffect(() => {
    setState(prevState => {
      const reviews = constructUpdatedUniqueReviews({
        dataReviews: data?.reviews?.reviews ?? [],
        currentPage: prevState.currentPage,
        stateReviews: prevState.reviews,
      });

      const { showSeeMoreReviewsButton, showEmptyReviewsMessage } = getReviewsView(
        reviews,
        data?.reviews.reviews ?? [],
        false,
        REVIEWS_LIMIT,
        reviewTotalCount
      );

      return {
        ...prevState,
        reviews,
        showSeeMoreReviewsButton,
        showEmptyReviewsMessage,
      };
    });
  }, [data?.reviews.reviews, state.scoreFilter, reviewTotalCount]);

  const localeOptions = useMemo(
    () => constructLocaleOptions(data?.reviews?.meta?.locales ?? "", activeLocale),
    [activeLocale, data?.reviews?.meta?.locales]
  );

  if (loading && !data) return <ReviewsLoading />;
  if (error || !data) return <ErrorReviews />;

  return (
    <CommonReviewsContainer
      reviews={state.reviews}
      reviewTotalCount={reviewTotalCount}
      reviewTotalScore={reviewTotalScore}
      changeReviewsLocaleFilter={changeLocaleFilter}
      changeReviewsScoreFilter={changeScoreFilter}
      localeFilter={state.localeFilter}
      scoreFilter={state.scoreFilter}
      localeOptions={localeOptions}
      clearFilters={clearFilters}
      loading={loading}
      showEmptyReviewsMessage={!loading && state.showEmptyReviewsMessage}
      showSeeMoreReviewsButton={
        !loading && state.reviews.length > 0 && state.showSeeMoreReviewsButton
      }
      getMoreReviews={getMoreReviews}
      currentPage={state.currentPage}
      reviewsLogo={reviewsLogo}
    />
  );
};

export default ReviewsContainer;
