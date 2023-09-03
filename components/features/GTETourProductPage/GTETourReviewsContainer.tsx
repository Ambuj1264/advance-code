import React, { useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import ReviewsLoading from "../Reviews/ReviewsLoading";
import ErrorReviews from "../Reviews/ErrorReviews";
import CommonReviewsContainer from "../Reviews/CommonReviewsContainer";

import GTETourReviewQuery from "./queries/GTETourReviewQuery.graphql";
import { constructGTETourReviews, constructReviewsLocaleOptions } from "./utils/gteTourUtils";

import useActiveLocale from "hooks/useActiveLocale";
import Section from "components/ui/Section/Section";
import { MobileContainer } from "components/ui/Grid/Container";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import SectionContent from "components/ui/Section/SectionContent";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { SupportedLanguages } from "types/enums";
import useQueryClient from "hooks/useQueryClient";

type State = {
  totalReviews: number;
  reviewsAmount: number;
  start: number;
  localeFilter: string;
  reviews: Review[];
  localeOptions: SupportedLanguages[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = () => {};

const REVIEWS_LIMIT = 10;

const GTETourReviewContainer = ({
  productCode,
  reviewTotalScore,
  reviewTotalCount,
}: {
  productCode?: string;
  reviewTotalScore: number;
  reviewTotalCount: number;
}) => {
  const { t } = useTranslation();
  const activeLocale = useActiveLocale();
  const initialState = useMemo(
    () => ({
      totalReviews: 0,
      reviews: [],
      start: 1,
      reviewsAmount: REVIEWS_LIMIT,
      localeFilter: activeLocale,
      localeOptions: [],
    }),
    [activeLocale]
  );
  const [state, setState] = useState<State>(initialState);

  const fetchMoreReviews = useCallback(() => {
    setState({
      ...state,
      reviewsAmount: REVIEWS_LIMIT,
      start: state.start + REVIEWS_LIMIT,
    });
  }, [state, state.reviewsAmount]);

  const input = {
    productCode,
    start: state.start,
    take: state.reviewsAmount,
    language: state.localeFilter,
  };

  const onClearFilters = useCallback(() => {
    setState({
      ...initialState,
      localeFilter: "",
    });
  }, [initialState, state]);

  const changeLocaleFilter = useCallback(
    (localeFilter: string) => {
      if (localeFilter !== state.localeFilter) {
        setState({
          ...initialState,
          localeFilter,
        });
      }
    },
    [initialState, state]
  );

  const { error, data, loading } = useQueryClient<GTETourTypes.QueryTourReviews>(
    GTETourReviewQuery,
    {
      variables: {
        input,
      },
      skip: !productCode,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ toursAndTicketsSingleProductReviews }) => {
        const reviews = state.reviews.concat(
          constructGTETourReviews(toursAndTicketsSingleProductReviews.reviews)
        );
        setState({
          ...state,
          reviews,
          totalReviews: toursAndTicketsSingleProductReviews.totalReviews,
          localeOptions: constructReviewsLocaleOptions(
            toursAndTicketsSingleProductReviews.availableLanguages,
            activeLocale
          ),
        });
      },
    }
  );
  if (data && data.toursAndTicketsSingleProductReviews?.totalReviews === 0) {
    return null;
  }
  return (
    <Section key="reviews" id="reviews" hasAnchorTarget data-nosnippet>
      <MobileContainer>
        <LeftSectionHeading>{t("Verified reviews")}</LeftSectionHeading>
        <SectionContent>
          {loading && !data && <ReviewsLoading />}
          {error && <ErrorReviews />}
          {data && (
            <LazyComponent lazyloadOffset={LazyloadOffset.Medium}>
              <CommonReviewsContainer
                reviews={state.reviews}
                reviewTotalCount={reviewTotalCount}
                reviewTotalScore={reviewTotalScore}
                changeReviewsLocaleFilter={changeLocaleFilter}
                changeReviewsScoreFilter={doNothing}
                localeFilter={state.localeFilter}
                scoreFilter=""
                localeOptions={state.localeOptions}
                clearFilters={onClearFilters}
                loading={loading}
                showEmptyReviewsMessage={state.reviews.length === 0}
                showSeeMoreReviewsButton={state.totalReviews > state.reviewsAmount}
                getMoreReviews={fetchMoreReviews}
                currentPage={1}
                disableRatingFilter
              />
            </LazyComponent>
          )}
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

export default GTETourReviewContainer;
