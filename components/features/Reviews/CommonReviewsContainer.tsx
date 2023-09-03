import React, { useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme, useTheme } from "emotion-theming";

import Reviews from "./Reviews";
import EmptyReviews from "./EmptyReviews";

import Button from "components/ui/Inputs/Button";
import { ButtonSize, SupportedLanguages } from "types/enums";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { getResizeObserver } from "utils/helperUtils";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.small}px;
  ${mqMin.medium} {
    margin-top: ${gutters.large}px;
  }
`;

const CommonReviewsContainer = ({
  reviews,
  reviewTotalScore,
  reviewTotalCount,
  reviewsLogo,
  changeReviewsLocaleFilter,
  changeReviewsScoreFilter,
  localeFilter,
  scoreFilter,
  localeOptions,
  loading,
  showEmptyReviewsMessage,
  clearFilters,
  showSeeMoreReviewsButton,
  getMoreReviews,
  currentPage,
  disableRatingFilter,
  hideTotalRatings,
}: {
  reviews: Review[];
  reviewTotalScore: number;
  reviewTotalCount: number;
  reviewsLogo?: Image;
  changeReviewsLocaleFilter: (reviewsLocaleFilter: string) => void;
  changeReviewsScoreFilter: (reviewsScoreFilter: string) => void;
  localeFilter: string;
  scoreFilter: string;
  localeOptions: SupportedLanguages[];
  loading: boolean;
  showEmptyReviewsMessage: boolean;
  clearFilters: () => void;
  showSeeMoreReviewsButton: boolean;
  getMoreReviews?: (e: React.SyntheticEvent<Element, Event>) => void;
  currentPage: number;
  disableRatingFilter?: boolean;
  hideTotalRatings?: boolean;
}) => {
  const theme: Theme = useTheme();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const onRefSet = useCallback(containerRef => {
    setRef(containerRef);
  }, []);

  const onChangeReviewsLocaleFilter = useCallback(
    (newLocale: string) => {
      if (newLocale !== localeFilter) {
        changeReviewsLocaleFilter(newLocale);
      }
    },
    [changeReviewsLocaleFilter, localeFilter]
  );

  const onChangeReviewsScoreFilter = useCallback(
    (newScore: string) => {
      if (newScore !== scoreFilter) {
        changeReviewsScoreFilter(newScore);
      }
    },
    [changeReviewsScoreFilter, scoreFilter]
  );

  useEffect(() => {
    const hasPageChanged = currentPage > 1;
    if (ref && typeof ResizeObserver !== "undefined" && hasPageChanged) {
      const [myObserver] = getResizeObserver(() => {
        // Manually scroll on expanding the reviews to avoid the BookingWidget from jumping
        window.scrollTo(window.scrollX + 1, window.scrollY + 1);
      });
      myObserver.observe(ref);
      return () => myObserver.unobserve(ref);
    }
    return undefined;
  }, [ref, currentPage]);
  return (
    <ErrorBoundary>
      <div ref={onRefSet}>
        <Reviews
          reviews={reviews}
          reviewTotalScore={reviewTotalScore}
          reviewTotalCount={reviewTotalCount}
          changeReviewsLocaleFilter={onChangeReviewsLocaleFilter}
          changeReviewsScoreFilter={onChangeReviewsScoreFilter}
          localeFilter={localeFilter}
          scoreFilter={scoreFilter}
          loading={loading}
          localeOptions={localeOptions}
          reviewsLogo={reviewsLogo}
          disableRatingFilter={disableRatingFilter}
          hideTotalRatings={hideTotalRatings}
        />
        {showEmptyReviewsMessage && <EmptyReviews clearFilters={clearFilters} />}
        {showSeeMoreReviewsButton && (
          <ButtonWrapper>
            <div>
              <Button
                onClick={getMoreReviews}
                id="seeMoreReviews"
                buttonSize={ButtonSize.Small}
                theme={theme}
              >
                <Trans ns={Namespaces.reviewsNs}>See more reviews</Trans>
              </Button>
            </div>
          </ButtonWrapper>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default withTheme(CommonReviewsContainer);
