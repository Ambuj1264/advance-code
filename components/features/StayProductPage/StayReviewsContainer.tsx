import React, { useCallback, useContext, useState } from "react";

import StayReviewsQuery from "./queries/StayReviewsQuery.graphql";
import { constructReviews } from "./utils/stayUtils";

import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";
import ErrorReviews from "components/features/Reviews/ErrorReviews";
import LocaleContext from "contexts/LocaleContext";
import CommonReviewsContainer from "components/features/Reviews/CommonReviewsContainer";
import { MobileContainer } from "components/ui/Grid/Container";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { SupportedLanguages } from "types/enums";
import useQueryClient from "hooks/useQueryClient";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const StayReviewsContainer = ({
  productId,
  reviewTotalScore,
  reviewTotalCount,
  isModalView,
}: {
  productId: number;
  reviewTotalScore: number;
  reviewTotalCount: number;
  isModalView?: boolean;
}) => {
  const activeLocale = useContext(LocaleContext);
  const [localeFilter, setLocaleFilter] = useState(activeLocale);

  const changeLocaleFilter = useCallback((newLocaleFilterValue: string) => {
    setLocaleFilter(newLocaleFilterValue as SupportedLanguages);
  }, []);

  const { error, data, loading } = useQueryClient<{
    staysProductReviews: StayTypes.QueryReviews;
  }>(StayReviewsQuery, {
    variables: {
      productId,
      language: localeFilter || null,
    },
  });

  const reviews = constructReviews(data?.staysProductReviews?.reviews);

  if (reviews.length === 0) return null;
  return (
    <Section key="reviews" id="reviews" hasAnchorTarget>
      <MobileContainer>
        <LeftSectionHeading>
          <Trans ns={Namespaces.commonNs}>Verified reviews</Trans>
        </LeftSectionHeading>
        <SectionContent>
          {loading && !data && <ReviewsLoading />}
          {error && <ErrorReviews />}
          {data && isModalView && (
            <CommonReviewsContainer
              reviews={reviews}
              reviewTotalCount={reviewTotalCount}
              reviewTotalScore={reviewTotalScore}
              changeReviewsLocaleFilter={changeLocaleFilter}
              changeReviewsScoreFilter={noop}
              localeFilter={localeFilter}
              scoreFilter=""
              localeOptions={data.staysProductReviews?.locales || []}
              clearFilters={noop}
              loading={loading}
              showEmptyReviewsMessage={false}
              showSeeMoreReviewsButton={false}
              getMoreReviews={noop}
              currentPage={1}
              disableRatingFilter
            />
          )}
          {data && !isModalView && (
            <LazyComponent lazyloadOffset={LazyloadOffset.Medium}>
              <CommonReviewsContainer
                reviews={reviews}
                reviewTotalCount={reviewTotalCount}
                reviewTotalScore={reviewTotalScore}
                changeReviewsLocaleFilter={changeLocaleFilter}
                changeReviewsScoreFilter={noop}
                localeFilter={localeFilter}
                scoreFilter=""
                localeOptions={data.staysProductReviews?.locales || []}
                clearFilters={noop}
                loading={loading}
                showEmptyReviewsMessage={false}
                showSeeMoreReviewsButton={false}
                getMoreReviews={noop}
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

export default StayReviewsContainer;
